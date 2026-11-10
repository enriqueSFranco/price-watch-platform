import { FakeAuthRepository } from "../../infrastructure/repository/FakeAuthRepository";
import { LoginUseCase } from "../use-cases/login.usecase";
import { LogoutUseCase } from "../use-cases/logout.usecase";

export class AuthService {
  private repo = new FakeAuthRepository();
  private loginUC = new LoginUseCase(this.repo);
  private logoutUC = new LogoutUseCase(this.repo);

  login(email: string, password: string) {
    return this.loginUC.execute(email, password);
  }

  logout() {
    return this.logoutUC.execute();
  }
}
