import type { ColumnDefinition, RowItemWhitId } from './types';
import styles from './table.module.css';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

interface TableProps<T extends RowItemWhitId> {
	caption?: string;
	summary?: string;
	columns: ColumnDefinition<T>[];
	rows: T[];
	isLoading?: boolean;
}

export function Table<T extends RowItemWhitId>({ caption, summary, columns, rows, isLoading = false }: TableProps<T>) {
	return (
		<table
			summary={summary}
			className={`table-auto md:table-fixed border-collapse w-full ${styles.tableProducts}`}
			aria-label={caption ? caption : 'table title'}
		>
			{caption && <caption className={styles.tableCaption}>{caption}</caption>}
			<TableHeader columns={columns} />
			<tbody className={styles.tableBody} role="rowgroup">
				{isLoading ? (
					<tr className={styles.tableRowLoader}>
						<td colSpan={columns.length} className={styles.cell}>
							<div className={styles.skeletonLoaderContainer}>
								{Array.from({ length: 5 }).map((_, idx) => (
									<div key={idx} className={styles.skeletonRow}>
										{columns.map((_, i) => (
											<div key={i} className={styles.skeletonCell}></div>
										))}
									</div>
								))}
							</div>
						</td>
					</tr>
				) : (
					rows?.map((rowItem) => <TableRow key={`tableRow-${rowItem.id}`} item={rowItem} columns={columns} />)
				)}
			</tbody>
		</table>
	);
}
