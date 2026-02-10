'use client';

import type { Product } from '@/modules/products/domain/Product.schema';
import { useOptimistic } from 'react';

type OptimisticActions = {
	optimisticUpdateProduct: (product: Product) => Promise<void>;
	optimisticDeleteProduct: (productId: string) => Promise<void>;
};

/**
 * Hook para gestionar de forma optimista una lista de productos.
 * @param products - La lista de productos
 * @returns El estado optimista y una función para actualizarlo
 */
export function useOptimisticProducts(products: Product[] = []): [Product[], OptimisticActions] {
	const [optimisticProducts, setOptimisticProducts] = useOptimistic(
		products,
		(state, action: { type: 'update'; updatedProduct: Product } | { type: 'delete'; productId: string }) => {
			switch (action.type) {
				case 'update':
					return state.map((p) => (p.id === action.updatedProduct.id ? action.updatedProduct : p));
				case 'delete':
					return state.filter((p) => p.id !== action.productId);
				default:
					return state;
			}
		},
	);

	const optimisticDeleteProduct = async (productId: string) => {
		setOptimisticProducts({ type: 'delete', productId });
	};

	const optimisticUpdateProduct = async (product: Product) => {
		setOptimisticProducts({ type: 'update', updatedProduct: product });
	};

	return [optimisticProducts, { optimisticUpdateProduct, optimisticDeleteProduct }];
}
