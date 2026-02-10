import jwt, { JwtPayload } from "jsonwebtoken";
import { Token, TokenErrors } from "../domain/Token";

type DurationUnit = "s" | "m" | "h" | "d";
export type JwtExpiresIn = `${number}${DurationUnit}`;

const TIME_MULTIPLIERS: Record<DurationUnit, number> = {
  s: 1_000, // segundos a milisegundos
  m: 60_000, // minutos a milisegundos (60 * 1000)
  h: 3_600_000, // horas a milisegundos (60 * 60 * 1000)
  d: 86_400_000, // días a milisegundos (24 * 60 * 60 * 1000)
};

export class JwtService<TPayload extends object> {
  private readonly secret: string;
  private readonly expiresIn: JwtExpiresIn;

  static readonly Errors = {
    MISSING_SECRET: "MISSING_SECRET",
    INVALID_DURATION: "INVALID_DURATION",
  };

  constructor(secret: string, expiresIn: JwtExpiresIn = "7d") {
    if (!secret || !expiresIn) {
      throw new Error("JWT secret and expiration must be defined.");
    }
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  sign(payload: TPayload) {
    const tokenValue = jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
      algorithm: "HS256",
    });
    const expiresAt = new Date(Date.now() + this.toMs(this.expiresIn));
    return Token.create(tokenValue, expiresAt);
  }

  verify(token: Token): TPayload {
    try {
      const decoded = jwt.verify(token.Value, this.secret) as JwtPayload;
      if (!decoded || typeof decoded !== "object") {
        throw new Error(TokenErrors.INVALID_TOKEN);
      }
      return decoded as TPayload;
    } catch {
      throw new Error(TokenErrors.INVALID_TOKEN);
    }
  }

  private toMs(duration: JwtExpiresIn): number {
    const match = /^(\d+)([smhd])$/.exec(duration);

    if (!match) {
      throw new Error(JwtService.Errors.INVALID_DURATION);
    }
    const [, valueStr, unit] = match;
    const unitKey = unit as DurationUnit;

    // Usa la tabla de multiplicadores (TIME_MULTIPLIERS)
    const multiplier = TIME_MULTIPLIERS[unitKey];
    const value = Number(valueStr);

    if (isNaN(value) || !multiplier) {
      throw new Error(JwtService.Errors.INVALID_DURATION); // O un error más específico
    }

    return value * multiplier;
  }
}
