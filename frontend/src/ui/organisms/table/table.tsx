import styles from "./table.module.css";

interface RowItemWhitId {
  id: string;
}

interface ColumnDefinition<T extends RowItemWhitId> {
  key: keyof T | string;
  header: string;
  renderCell?: (item: T) => React.ReactNode;
}

interface TableProps<T extends RowItemWhitId> {
  caption?: string;
  summary?: string
  columns: ColumnDefinition<T>[];
  rows: T[];
}

export function Table<T extends RowItemWhitId>({
  caption,
  summary,
  columns,
  rows,
}: TableProps<T>) {
  return (
    <table
      summary={summary}
      className={styles.tableProducts}
      aria-label={caption ? caption : "tabla de datos"}
    >
      {caption && <caption className={styles.tableCaption}>{caption}</caption>}
      <TableHeader columns={columns} />
      <tbody className={styles.tableBody} role="rowgroup">
        {rows.length === 0 ? (
          <tr className={styles.tableRow}>
            <td
              colSpan={columns.length}
              className={styles.cell}
              style={{ textAlign: "center", padding: "20px" }}
            >
              No hay datos para mostrar.
            </td>
          </tr>
        ) : (
          rows.map((rowItem) => (
            <TableRow
              key={`tableRow-${rowItem.id}`}
              item={rowItem}
              columns={columns}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

interface TableHeaderProps<T extends RowItemWhitId> {
  columns: ColumnDefinition<T>[];
}
function TableHeader<T extends RowItemWhitId>({
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

interface TableRowProps<T extends RowItemWhitId> {
  item: T;
  columns: ColumnDefinition<T>[];
}

function TableRow<T extends RowItemWhitId>({
  item,
  columns,
}: TableRowProps<T>) {
  return (
    <tr key={`row-${item.id}`} className={styles.tableRow}>
      {columns.map((col) => (
        <td key={`cell-${String(col.key)}`} className={styles.cell}>
          {col.renderCell
            ? col.renderCell(item)
            : String(item[col.key as keyof T])}
        </td>
      ))}
    </tr>
  );
}
