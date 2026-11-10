import { User } from "../../../users/domain/entities/User";
import { Email } from "../../../../core/domain/value-objects/Email";
import { HashedPassword } from "../../../../core/domain/value-objects/HashedPassword";
import { RegisterUserDTO } from "../dto/RegisterUser.dto";
import { IPasswordHasher } from "../../../../core/application/services/IPasswordHasher";
import { UserRepositoryPort } from "../../../users/domain/repositories/IUserRepositoryPort";
import { JwtService } from "../../infrastructure/JwtService";
import { Result } from "../../../../shared/utils/Result"
import {UserErrors} from "../../../users/domain/errors/UserErrors"

interface AuthTokenPayload {
  userId: string;
}

/**
 * @description Caso de uso para registar un nuevo usuario
 * Flujo:
 * 1. Validar si el email ya existe.
 * 2.- Hashear la contraseña
 * 3.- Crear la entidad User
 * 4.- Persistir en el repositorio
 * 5.- Retornar un DTO con los datos del usuario (sin exponer el hash).
 */
export class RegisterUseCase {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly passwordHasher: IPasswordHasher,
    private readonly jwtService: JwtService<AuthTokenPayload>
  ) {}

  public execute = async (
    data: RegisterUserDTO
  ): Promise<Result<RegisterUserDTO>> => {
    const { email, password } = data;

    const isExistingUser = await this.userRepo.findByEmail(email);
    // usando el patron Result
    if (isExistingUser) return Result.error(UserErrors.USER_ALREADY_EXISTS);

    const emailVO = Email.create(data.email);

    const hashedPassword = await HashedPassword.fromPlain(
      password,
      this.passwordHasher
    );
    const newUser = User.createNew(emailVO, hashedPassword);

    const savedUser = await this.userRepo.save(newUser);
    const payload: AuthTokenPayload = {
      userId: savedUser.Id.value,
    };
    const token = this.jwtService.sign(payload);
    return Result.success({
      id: savedUser.Id,
      email: savedUser.Email.Value,
      password: savedUser.PasswordHash.Value,
      token: token.Value,
      expiresAt: token.ExpiresAt,
      createdAt: new Date(),
    });
  };
}
