import { Product } from '@/modules/products/domain/Product.schema';

export interface AutocompleteItem {
	id: string | number;
	label: string;
	[key: string]: any;
}

export type SearchFunction<T extends AutocompleteItem> = (query: string, data: T[]) => Product[];
