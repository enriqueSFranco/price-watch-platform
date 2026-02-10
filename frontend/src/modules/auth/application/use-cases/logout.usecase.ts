import type { AuthRepository } from "@/modules/auth/domain/AuthRepository";

export class LogoutUseCase {
  constructor(private readonly repo: AuthRepository) {}

  async execute() {
    await this.repo.logout();
  }
}
