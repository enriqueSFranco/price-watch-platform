import { cn } from '@/lib/cn';
import { ColumnDefinition, RowItemWhitId } from './types';
import { CellContent } from '../cell-content/CellContent';
import styles from './table.module.css';

interface TableRowProps<T extends RowItemWhitId> {
	item: T;
	columns: ColumnDefinition<T>[];
}

export function TableRow<T extends RowItemWhitId>({ item, columns }: TableRowProps<T>) {
	return (
		<tr key={`row-${item.id}`} className={cn(styles.tableRow, styles.fadeInRow)}>
			{columns.map((col) => (
				<td key={`cell-${String(col.key)}`} className={styles.cell}>
					<CellContent>{col.renderCell ? col.renderCell(item) : String(item[col.key as keyof T])}</CellContent>
				</td>
			))}
		</tr>
	);
}
