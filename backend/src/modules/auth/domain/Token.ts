export enum TokenErrors {
  INVALID_TOKEN = "INVALID_TOKEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED"
}

export class Token {
  private constructor(
    private readonly value: string,
    private readonly expiresAt?: Date
  ) {
    if (!value || value.trim().length === 0) {
      throw new Error(TokenErrors.INVALID_TOKEN);
    }
  }

  static create(value: string, expiresAt?: Date): Token {
    return new Token(value, expiresAt);
  }

  get Value() {
    return this.value;
  }

  get ExpiresAt() {
    return this.expiresAt
  }

  get isExpired() {
    if (!this.expiresAt) return false;
    return this.expiresAt.getTime() < Date.now();
  }
}
