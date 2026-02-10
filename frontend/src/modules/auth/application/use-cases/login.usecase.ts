import type { AuthRepository } from '../../domain/AuthRepository';
import type { AuthUser } from '../../domain/AuthUser';

export class LoginUseCase {
	constructor(private readonly repo: AuthRepository) {}

	async execute(email: string, password: string): Promise<AuthUser> {
		return await this.repo.login(email, password);
	}
}
