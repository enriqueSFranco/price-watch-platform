import { baseApi } from './baseApi';

// Aquí agregamos endpoints a la API base
export const apiSlice = baseApi.injectEndpoints({
	endpoints: (build) => ({
		fakeLogin: build.mutation({
			query: (body) => ({
				url: '/api/auth/login',
				method: 'POST',
				body,
			}),
		}),
		fakeLogout: build.mutation<void, void | undefined>({
			query: () => ({
				url: '/api/auth/logout',
				method: 'POST',
			}),
		}),
		register: build.mutation({
			query: (body) => ({
				url: '/api/auth/register',
				method: 'POST',
				body,
			}),
		}),
		login: build.mutation({
			query: (body) => ({
				url: '/api/auth/login',
				method: 'POST',
				body,
			}),
		}),
		logout: build.mutation<void, void>({
			query: () => ({
				url: '/api/auth/logout',
				method: 'POST',
			}),
		}),
		getProducts: build.query({
			query: () => ({ url: '/api/products', method: 'GET' }),
		}),
		addProduct: build.mutation({
			query: (body) => ({ url: '/api/products', method: 'POST', body }),
		}),
	}),
	overrideExisting: false,
});

export const {
	useFakeLoginMutation,
	useFakeLogoutMutation,
	useRegisterMutation,
	useLoginMutation,
	useLogoutMutation,
	useGetProductsQuery,
	useAddProductMutation,
} = apiSlice;
