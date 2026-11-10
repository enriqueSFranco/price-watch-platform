import { baseApi } from './baseApi';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/sections/auth/store/auth.slice';

export const makeStore = () => {
	return configureStore({
		reducer: {
			[baseApi.reducerPath]: baseApi.reducer,
			auth: authReducer,
		},
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
