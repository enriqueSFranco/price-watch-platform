import { configureStore } from "@reduxjs/toolkit";
// import productsReducer from "./features/products/product.slice"
import {productsApi} from "./features/products/products.api"

export const store = configureStore({
  reducer: {
    // products: productsReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware)
})

export type AppStore = typeof store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
