// import {
//   createApi,
//   fetchBaseQuery,
//   FetchBaseQueryError,
// } from "@reduxjs/toolkit/query/react";
// import mockProducts from "@/__mocks__/products.json";
// import { Source } from "@/modules/spider/domain/enums";
// import { SpiderProduct } from "@/modules/spider/domain/SpiderProduct";
// import { ProductDTO } from "@/modules/products/domain/product.schema";

import { baseApi } from '@/store/baseApi';

// // Define el contrato exacto de tu respuesta API
// interface Pagination {
//   page: number;
//   limit: number;
//   nextPage: string | null;
//   prevPage: string | null;
// }

// // Interfaz que envuelve tus productos y la paginación
// interface ProductsResponse {
//   data: ProductDTO[];
//   pagination: Pagination;
// }

// export const productsApi = baseApi.injectEndpoints({
//   endpoints: build => ({
//     getProducts: build.query({
//       query: () => ({url: "/api/products", method: "GET"})
//     }),
//     addProduct: build.mutation({
//       query: (body) => ({url: "/api/products", method: "POST", body})
//     })
//   })
// }
// export const productsApi = createApi({
//   reducerPath: "productsApi",
//   baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
//   tagTypes: ["Products"],
//   endpoints: (builder) => ({
//     spiderProduct: builder.mutation<
//       SpiderProduct,
//       { site: Source; productUrl: string }
//     >({
//       query: ({ site, productUrl }) => {
//         return `/scrape?site=${site}&product_url=${encodeURIComponent(
//           productUrl
//         )}`;
//       },
//     }),
//     searchProducts: builder.query<ProductsResponse, string>({
//       async queryFn(query) {
//         await new Promise((resolve) => setTimeout(resolve, 300));

//         if (!query) return { data: mockProducts };

//         const escapedQuery = query
//           .toLowerCase()
//           .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//         const filteredData = mockProducts.data.filter((p) =>
//           p.latestData.name.toLowerCase().startsWith(escapedQuery)
//         );

//         const filteredResponse: ProductsResponse = {
//           data: filteredData,
//           pagination: {
//             ...mockProducts.pagination,
//           },
//         };
//         return { data: filteredResponse };
//       },
//       providesTags: ["Products"],
//     }),
//     editProduct: builder.mutation<ProductDTO, Partial<ProductDTO>>({
//       async queryFn() {
//         return new Promise((resolve) => setTimeout(resolve, 300));
//       },
//       invalidatesTags: ["Products"],
//     }),
//   }),
// });

// export const {
//   useSpiderProductMutation,
//   useSearchProductsQuery,
//   useEditProductMutation,
// } = productsApi;
