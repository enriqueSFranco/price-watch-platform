import { IPasswordHasher } from "../../../../src/core/application/services/IPasswordHasher";
import {HashedPassword} from "../../../../src/core/domain/value-objects/HashedPassword"

// describe -> agrupa test relacionados
describe("HashedPassword (Domain)", () => {
  // Declaramos un mock del puerto
  let mockHasher: jest.Mocked<IPasswordHasher>; // mock -> Permite crear implementaciones falsas

  // Se ejecuta antes de cada test.
  // Sirve para limpiar mocks o preparar objetos frescos.
  beforeEach(() => {
    mockHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };
  });

  // test() / it() -> Un test individual.
  test("fromPlain(): should throw an error if the password is too short", async () => {
    // expect -> Hace afirmaciones.
    await expect(
      HashedPassword.fromPlain("123", mockHasher)
    ).rejects.toThrow("Password must be at least");
  });

  test("fromPlain(): debe hashear usando el hasher y devolver una instancia valida", async () => {
    mockHasher.hash.mockResolvedValue("x".repeat(60));

    const result = await HashedPassword.fromPlain("secret123", mockHasher);

    expect(mockHasher.hash).toHaveBeenCalledWith("secret123");
    expect(result).toBeInstanceOf(HashedPassword);
    expect(result.Value).toBe("x".repeat(60))
  });

  test("fromHash(): debe crear una instancia valida si el hash es correcto", async () => {
    const hp = HashedPassword.fromHash("x".repeat(60))
    expect(hp).toBeInstanceOf(HashedPassword);
    expect(hp.Value).toBe("x".repeat(60))
  })

  test("fromHash(): debe fallar si el hash es demaciado corto", async () => {
    expect(() => HashedPassword.fromHash("secret123")).toThrow(
      "invalid hash value"
    );
  });

  test("matches(): debe delegar la comparacion del hasher", async () => {
    const hash = "x".repeat(60)
    const hp = HashedPassword.fromHash(hash);

    mockHasher.compare.mockResolvedValue(true);
    const result = await hp.matches("secret123", mockHasher)
    expect(mockHasher.compare).toHaveBeenCalledWith("secret123", hash);
    expect(result).toBe(true);
  });
});
