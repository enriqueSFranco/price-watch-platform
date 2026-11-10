import { TextInput } from '@/components/desing-system/TextInput/TextInput';

interface SearchFormProps {
	label?: string;
	onSearch?: () => void;
}

export function SearchForm({ label, onSearch }: SearchFormProps) {
	return (
		<form id="form-search">
			<TextInput type="search" name="field-keywords" onChange={onSearch} label={label} />
		</form>
	);
}
