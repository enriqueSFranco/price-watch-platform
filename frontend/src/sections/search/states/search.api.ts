import { Product, RowProduct } from '@/core/entities/Product';
import { RowProductSchema } from '@/modules/products/domain/Product.schema';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { modifyRowProduct } from '../search-utils';

// llamadas a backend especificas de search
export const SEARCH_ENDPOINTS = {
	BASE: '/search',
	BY_KEYWORD: (keyword: string) => `/search?q=${keyword}`,
};

export const searchApi = createApi({
	reducerPath: 'searchApi',
	baseQuery: fetchBaseQuery({ baseUrl: '/search' }),
	tagTypes: ['Product'],
	endpoints: (builder) => ({
		search: builder.query<Product[], string>({
			query: (q: string) => `/products/search?q=${q}`,
			transformResponse: (response: RowProduct[]): Product[] => {
				if (response.length === 0) return [];
				const parseProducts = RowProductSchema.array().parse(response);
				const modifiedProducts = modifyRowProduct(parseProducts);
				return modifiedProducts;
			},
			providesTags: ['Product'],
		}),
	}),
});
