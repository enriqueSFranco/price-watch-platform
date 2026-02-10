import bcrypt from "bcryptjs";
import { BcryptPasswordHasher } from "../../../../src/core/infraestructure/security/BcryptPasswordHasher";

// Esto sustituye TODAS las funciones de bcrypt con mocks
jest.mock("bcryptjs");

describe("BcryptPasswordHasher (Adapter)", () => {
  const hasher = new BcryptPasswordHasher();

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("hash(): debe generar un hash usando bcrypt.genSalt y bcrypt.hash", async () => {
    // Configuramos valores que los mocks devolverán
    (bcrypt.genSalt as jest.Mock)
      .mockResolvedValue("fake-salt")

    (bcrypt.hash as jest.Mock)
      .mockResolvedValue("hashed-value");

    const result = await hasher.hash("myPass123");
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith("myPass123", "fake-salt");
    expect(result).toBe("hashed-value");
  });
});
