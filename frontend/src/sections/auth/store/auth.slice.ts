import type { AuthUser } from '@/modules/auth/domain/AuthUser';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
	user: AuthUser | null;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
	user: typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('auth:user') || 'null') : null,
	isAuthenticated: typeof window !== 'undefined' ? !!window.localStorage.getItem('auth:user') : false,
};

export const authSlice = createSlice({
	name: 'authSlice',
	initialState,
	reducers: {
		loginSuccess(state, action: PayloadAction<AuthUser>) {
			state.user = action.payload;
			state.isAuthenticated = true;

			localStorage.setItem('auth:user', JSON.stringify(action.payload));
			Cookies.set('session', 'true', { expires: 7 });
		},
		clearUser(state) {
			state.user = null;
			state.isAuthenticated = false;

			window.localStorage.removeItem('auth:user');
			Cookies.remove('session');
		},
	},
});

export const { loginSuccess, clearUser } = authSlice.actions;
export default authSlice.reducer;
