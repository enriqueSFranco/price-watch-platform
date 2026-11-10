import { Product } from '@/modules/products/domain/Product.schema';

export interface SearchProductPort {
	search(query: string, data: Product[]): Promise<Product[]>;
}
