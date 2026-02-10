import { IPasswordHasher } from "../../application/services/IPasswordHasher";
import bcrypt from "bcryptjs";

/**
 * Adaptador concreto del puerto `PasswordHasher` usando la librería `bcryptjs`.
 *
 * Responsabilidades:
 *   - Generar hashes seguros para contraseñas planas.
 *   - Comparar contraseñas planas con hashes almacenados.
 *
 * Patrón aplicado: Adapter
 *
 * Configuración:
 *   - `SALT_ROUNDS` define el costo computacional del hash (mayor = más seguro, más lento).
 *
 * Recomendaciones:
 *   - No exponer este adaptador directamente en controladores.
 *   - Usar inyección de dependencias para mayor testabilidad.
 */
export class BcryptPasswordHasher implements IPasswordHasher {
  /** Número de rondas de sal (parámetro de seguridad). */
  private static readonly SALT_ROUNDS = 10;

  /**
   * Genera un hash seguro para una contraseña en texto plano.
   *
   * @param plain - Contraseña en texto plano.
   * @returns Hash resultante en formato bcrypt.
   * @throws Error si el parámetro es inválido o si bcrypt falla.
   */
  public hash = async (plain: string): Promise<string> => {
    if (!plain || plain.trim().length === 0) {
      throw new Error("BcryptPasswordHasher: password cannot be empty.");
    }

    try {
      const salt = await bcrypt.genSalt(BcryptPasswordHasher.SALT_ROUNDS);
      return bcrypt.hash(plain, salt);
    } catch (e) {
      throw new Error(
        `BcryptPasswordHasher: failed to hash password. ${(e as Error).message}`
      );
    }
  };

  /**
   * Compara una contraseña plana con un hash almacenado.
   *
   * @param plain - Contraseña en texto plano.
   * @param hash - Hash almacenado (bcrypt).
   * @returns `true` si coinciden, `false` si no.
   * @throws Error si los parámetros son inválidos o si bcrypt falla.
   */
  public compare = async (plain: string, hash: string): Promise<boolean> => {
    if (!plain || !hash) {
      throw new Error("BcryptPasswordHasher: invalid comparison arguments.");
    }

    try {
      return bcrypt.compare(plain, hash);
    } catch (e) {
      throw new Error(
        `BcryptPasswordHasher: failed to compare passwords. ${
          (e as Error).message
        }`
      );
    }
  };
}
