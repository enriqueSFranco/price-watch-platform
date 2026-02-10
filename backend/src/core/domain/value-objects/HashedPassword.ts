import { IPasswordHasher } from "../../application/services/IPasswordHasher";
/**
 * @description Representa la contraseña ya hasheada de un usuario.
 * Evita que el resto del sistema manipule contraseñas en texto plano.
 */

// 2.- Garantiza que siempre sea válida.
// 4.- Define las reglas de integridad para las contraseñas en el dominio.
export class HashedPassword {
  /** Longitud mínima esperada de un hash válido (bcrypt ≈ 60) */
  private static readonly MIN_HASH_LENGTH = 50;
  /** Longitud mínima de contraseñas planas antes de hashear */
  private static readonly MIN_PLAIN_LENGTH = 6;

  private constructor(private value: string) {
    if (!value || value.trim().length < HashedPassword.MIN_HASH_LENGTH) {
      throw new Error("HashedPassword: invalid hash value provided.");
    }
  }

  /**
   * Crea un objeto HashedPassword a partir de una contraseña en texto plano.
   *
   * @param plainPassword - Contraseña en texto plano.
   * @param hasher - Implementación del puerto PasswordHasher (bcrypt, argon2, etc.).
   * @returns Una instancia segura de HashedPassword.
   * @throws Error si la contraseña es inválida o vacía.
   */
  static async fromPlain(plainPassword: string, hasher: IPasswordHasher) {
    if (
      !plainPassword ||
      plainPassword.trim().length < HashedPassword.MIN_PLAIN_LENGTH
    ) {
      throw new Error(
        `Password must be at least ${HashedPassword.MIN_PLAIN_LENGTH} characters long.`
      );
    }

    const hash = await hasher.hash(plainPassword);
    return new HashedPassword(hash);
  }

  /**
   * Crea un objeto HashedPassword desde un hash ya existente.
   *
   * @param hash - Valor hasheado existente (por ejemplo, de la base de datos).
   * @returns Una instancia segura de HashedPassword.
   * @throws Error si el hash es inválido o demasiado corto.
   */
  static fromHash(hash: string) {
    return new HashedPassword(hash);
  }

  /**
   * Verifica si una contraseña plana coincide con este hash.
   *
   * @param plainPassword - Contraseña en texto plano a verificar.
   * @param hasher - Implementación del puerto PasswordHasher.
   * @returns `true` si coinciden, `false` en caso contrario.
   */
  async matches(plainPassword: string, hasher: IPasswordHasher) {
    return hasher.compare(plainPassword, this.value);
  }

  get Value() {
    return this.value;
  }
}
