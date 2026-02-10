import { createSlice } from '@reduxjs/toolkit';

interface FiltersState {
	filter: 'all' | 'activated' | 'paused';
}

const initialState: FiltersState = {
	filter: 'all',
};

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {},
});
