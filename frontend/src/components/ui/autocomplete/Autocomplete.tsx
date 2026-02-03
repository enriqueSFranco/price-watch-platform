'use client';
import { TextInput } from '../../desing-system/TextInput/TextInput';
import { AutocompleteItem, SearchFunction } from '@/modules/search/domain/search.schema';
import { IconSearch } from '../../Icons/icon-list-filter';
import { useState } from 'react';

interface AtocompleteProps<T extends AutocompleteItem> {
	data: T[];
	searchFn: SearchFunction<T>;
	placeholder?: string;
	onSelect: (item: T) => void;
	debounceTime?: number;
}

export const Atocomplete = <T extends AutocompleteItem>({
	data,
	placeholder,
	onSelect,
	debounceTime = 300,
	searchFn,
}: AtocompleteProps<T>) => {
	const [value, setValue] = useState('');
	// const {results} = useAutocomplete({data: [], searchFn: ("", []) => {}})
	const [isLoading, setIsLoading] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);

	function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
		// debouncedSearch(e.target.value);
	}

	return (
		<div className="w-full relative">
			<form id="form-search-product">
				<TextInput
					type="search"
					name="field-keywords"
					onChange={handleSearch}
					value={value}
					startIcon={<IconSearch />}
				/>
			</form>
			{isExpanded && (
				<div className="w-full absolute top-full h-48 bg-neutral-900 rounded-md mt-2 z-50">
					<ul>
						{[].map((item) => (
							<li key={`atocomplete-item-${item.id}`}></li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
