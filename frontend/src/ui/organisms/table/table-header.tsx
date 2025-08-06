import { ColumnDefinition, RowItemWhitId } from "./types";
import styles from "./table.module.css"

interface TableHeaderProps<T extends RowItemWhitId> {
  columns: ColumnDefinition<T>[];
}

export function TableHeader<T extends RowItemWhitId>({
  columns,
}: TableHeaderProps<T>) {
  return (
    <thead className={styles.tableHeader} role="rowgroup">
      <tr className={styles.tableRow}>
        {columns.map((col) => (
          <th
            key={`col-${String(col.key)}`}
            scope="col"
            className={styles.columnHeader}
          >
            {col.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
