export interface RowItemWhitId {
	id: string;
}

export interface ColumnDefinition<T extends RowItemWhitId> {
	key: keyof T | string;
	header: string;
	renderCell?: (item: T) => React.ReactNode;
}
