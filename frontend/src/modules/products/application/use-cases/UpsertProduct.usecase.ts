import { IProductRepositoryPort } from '../../domain/IProductRepositoryPort';
import { ProductDTO } from '../../domain/Product.schema';

export class UpsertProduct {
	constructor(private readonly productRepo: IProductRepositoryPort) {}

	async execute(product: ProductDTO) {
		return this.productRepo.save(product);
	}
}
