import type { AuthUser } from '../domain/AuthUser';

export class FakeAuthRepository {
	async login(email: string, password: string): Promise<AuthUser> {
		await new Promise((resolve) => setTimeout(resolve, 600));

		if (email === 'demo@demo.com' && password === 'qwerty1234') {
			return {
				id: 'fake-user-1',
				name: 'Demo User',
				email,
			};
		}
		throw new Error('Credenciales incorrectas');
	}

	async logout() {
		await new Promise((res) => setTimeout(res, 200));
	}
}
