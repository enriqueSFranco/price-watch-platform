import { Product } from './Product.schema';
import { ProductId } from './value-objects/ProductId';

export interface IProductRepositoryPort {
	findAll: () => Promise<Product[]>;
	findById: (id: ProductId) => Promise<Product>;
	save: (product: Product) => Promise<Product>;
	delete: (id: ProductId) => Promise<void>;
}
