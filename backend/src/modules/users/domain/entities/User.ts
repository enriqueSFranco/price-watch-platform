import { Id } from "../../../../core/domain/Id";
import { Email } from "../../../../core/domain/value-objects/Email";
import { HashedPassword } from "../../../../core/domain/value-objects/HashedPassword";

export class User {
  constructor(
    private readonly id: Id,
    private email: Email,
    private passwordHash: HashedPassword
  ) {}

  static createNew(email: Email, passwordHash: HashedPassword): User {
    return new User(Id.create(), email, passwordHash);
  }

  static reconstruct(id: Id, email: Email, passwordHash: HashedPassword) {
    return new User(id, email, passwordHash);
  }

  get Id() {
    return this.id;
  }

  get Email() {
    return this.email;
  }

  get PasswordHash() {
    return this.passwordHash;
  }
}

// 1. Validación en la capa de aplicación (Zod)
// const dto = RegisterUserSchema.parse(req.body);

// // 2. Transformación a Value Objects en la capa de dominio
// const email = Email.create(dto.email);
// const password = Password.create(dto.password);

// // 3. Creación de la entidad de dominio
// const user = new User(uuid(), email, password.hash());
