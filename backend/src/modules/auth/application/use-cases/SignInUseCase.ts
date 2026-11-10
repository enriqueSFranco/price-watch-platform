import { IPasswordHasher } from "../../../../core/application/services/IPasswordHasher";
import { Id } from "../../../../core/domain/Id";
import { HashedPassword } from "../../../../core/domain/value-objects/HashedPassword";
import { Result } from "../../../../shared/utils/Result";
import { UserRepositoryPort } from "../../../users/domain/repositories/IUserRepositoryPort";
import { AuthErrors } from "../../domain/AuthErrors";
import { Token } from "../../domain/Token";
import { JwtService } from "../../infrastructure/JwtService";
import { SignInDTO } from "../dto/SignIn.dto";

export class SignInUseCase {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly passwordHasher: IPasswordHasher,
    private readonly jwt: JwtService<{ userId: string }>
  ) {}

  public execute = async (data: SignInDTO): Promise<Result<{id: Id, email: string, password: string, token: Token}>> => {
    const { email, password } = data;
    // 1.- buscar el usuario
    const user = await this.userRepo.findByEmail(email);

    if (!user) return Result.error(AuthErrors.INVALID_CREDENTIALS);
    // 2.- validar la contraseña
    const isValid = await HashedPassword.fromPlain(
      password,
      this.passwordHasher
    );
    if (!isValid) throw new Error("Invalid credentials");

    // 3.- generar el token
    const token = this.jwt.sign({ userId: user.Id.value });

    // TODO: 4.- actualizar el último login
    return Result.success({
      id: user.Id,
      email,
      password,
      token,
    });
  };
}
