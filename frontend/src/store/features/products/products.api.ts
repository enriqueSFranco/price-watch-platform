import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { AddProductDataType, ProductType, ScrapedProduct } from "@/shared/types/product.d";
// import { fetchScrapedProduct } from "@/services/fetchScrapedProduct.service";
// import mockProducts from "@/mocks/data/mock-products-by-user.json";
import { EcommerceEnum } from "@/shared/types/e-commerce.enum";
// import { CustomError } from "@/shared/custom-error";
import { nanoid } from "@reduxjs/toolkit";

let allProducts: ProductType[] = [];

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    scrapeProduct: builder.mutation<
      ScrapedProduct,
      { site: EcommerceEnum; productUrl: string }
    >({
      query: ({ site, productUrl }) => {
        // MSW interceptará esta llamada GET a `/api/v1/scrape?...`
        return `/scrape?site=${site}&product_url=${encodeURIComponent(productUrl)}`;
      },
      // async queryFn({ site, productUrl }, { signal }) {
      //   try {

      //     const scrapedData = await fetchScrapedProduct(
      //       site,
      //       productUrl,
      //       signal
      //     );
      //     if (!scrapedData) {
      //       return {
      //         error: {
      //           status: "CUSTOM_ERROR",
      //           data: new CustomError("No se pudo obtener el producto", {
      //             code: "SCRAPER_ERROR",
      //           }),
      //         } as FetchBaseQueryError,
      //       };
      //     }
      //     return { data: scrapedData };
      //   } catch (error) {
      //     let customError: CustomError;

      //     if (error instanceof DOMException && error.name === "AbortError") {
      //       customError = new CustomError("Petición cancelada", {
      //         code: "NETWORK_ERROR",
      //       });
      //     } else if (error instanceof CustomError) {
      //       customError = error;
      //     } else {
      //       const message =
      //         error instanceof Error
      //           ? error.message
      //           : "An unexpected error occurred";
      //       customError = new CustomError(message, { code: "UNKNOWN" });
      //     }

      //     return {
      //       error: {
      //         status: "CUSTOM_ERROR",
      //         data: customError,
      //       } as FetchBaseQueryError,
      //     };
      //   }
      // },
    }),
    searchProducts: builder.query<ProductType[], string>({
      async queryFn(query) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!query) return { data: allProducts };

        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedQuery, "i");
        const filtered = allProducts.filter((p) => regex.test(p.name));
        return { data: filtered };
      },
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation<ProductType, AddProductDataType>({
      async queryFn(productData) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const newProduct: ProductType = {
          id: nanoid(),
          userId: "user-123",
          name: productData.name || "Producto nuevo",
          originalUrl: productData.url,
          domain: "example.com",
          imageUrl: null,
          currentPrice: 0,
          currency: "MXN",
          initialPrice: 0,
          lastCheckedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          status: "active",
          notificationRules: [],
        };
        allProducts.push(newProduct);
        return { data: newProduct };
      },
      invalidatesTags: ["Product"],
    }),
    editProduct: builder.mutation<ProductType, Partial<ProductType>>({
      async queryFn(productData) {
        await new Promise(resolve => setTimeout(resolve, 300))

        const isProductAlredy = allProducts.filter(p => p.id === productData.id)
        const updatedProduct: ProductType = {
          ...productData,
          ...isProductAlredy,
          lastCheckedAt: new Date().toISOString()
        } as ProductType
        allProducts = allProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        return { data: updatedProduct };
      },
      invalidatesTags: ['Product']
    }),
    deleteProduct: builder.mutation<void, string>({
      async queryFn(productId) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const findProductIndex =  allProducts.findIndex(p => p.id !== productId)
        if (findProductIndex === -1) {
          return { error: { status: 404, data: 'Product not found' } as FetchBaseQueryError };
        }
        return {data: undefined}
      }
    })
  }),
});

export const {
  useScrapeProductMutation,
  useSearchProductsQuery,
  useAddProductMutation,
  useEditProductMutation,
  useDeleteProductMutation
} = productsApi;
