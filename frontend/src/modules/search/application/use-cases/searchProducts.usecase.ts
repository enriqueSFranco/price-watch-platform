import { Product } from '@/modules/products/domain/Product.schema';

export const searchProductsUseCase = (products: Product[], query: string): Product[] => {
	const lowerCaseQuery = query.trim().toLowerCase();
	if (lowerCaseQuery.length === 0) return [];

	const results = products.filter((product) => product.name.toLowerCase().startsWith(lowerCaseQuery));
	return results.slice(0, 10);
};
