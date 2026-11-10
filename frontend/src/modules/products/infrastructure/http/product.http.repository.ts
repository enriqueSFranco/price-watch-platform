import { IProductRepositoryPort } from '../../domain/IProductRepositoryPort';
import { createProduct } from '../../domain/Product.schema';
import { ProductDTO } from '../../domain/Product.schema';
import { ProductId } from '../../domain/value-objects/ProductId';

export function makeHttpProductRepository(endpoint: string): IProductRepositoryPort {
	return {
		async findAll(): Promise<ProductDTO[]> {
			const res = await fetch(`${endpoint}/products`);
			const data = await res.json();
			return data.map(createProduct);
		},
		async findById(id: ProductId): Promise<ProductDTO> {
			const res = await fetch(`${endpoint}/products/${id.value}`);
			if (!res.ok) {
				return null;
			}
		},
		async save(product: ProductDTO): Promise<ProductDTO> {},
		async delete(id: ProductId): Promise<void> {},
	};
}
