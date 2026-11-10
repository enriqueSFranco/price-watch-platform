import { IProductRepositoryPort } from '../../domain/IProductRepositoryPort';

export class GetAllProducts {
	constructor(private readonly repo: IProductRepositoryPort) {}

	async excute() {
		return await this.repo.findAll();
	}
}
