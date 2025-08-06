import { CellContent } from "@/ui/atoms/CellContent/cell-content";
import { ColumnDefinition, RowItemWhitId } from "./types";
import { TableHeader } from "./table-header";
import { TableRow } from "./table-row";
import styles from "./table.module.css";
import clsx from "clsx";

interface TableProps<T extends RowItemWhitId> {
  caption?: string;
  summary?: string;
  columns: ColumnDefinition<T>[];
  rows: T[];
  isLoading?: boolean;
}

export function Table<T extends RowItemWhitId>({
  caption,
  summary,
  columns,
  rows,
  isLoading = false,
}: TableProps<T>) {
  return (
    <table
      summary={summary}
      className={styles.tableProducts}
      aria-label={caption ? caption : "tabla de productos"}
    >
      {caption && <caption className={styles.tableCaption}>{caption}</caption>}
      <TableHeader columns={columns} />
      <tbody
        className={clsx(styles.tableBody, styles.fadeInTable)}
        role="rowgroup"
      >
        {isLoading ? (
          <tr className={styles.tableRowLoader}>
            {/* Solo necesitamos una fila para el esqueleto de carga, que se ocupe de toda la tabla */}
            <td colSpan={columns.length} className={styles.cell}>
              <div className={styles.skeletonLoaderContainer}>
                {/* Repetimos la "tarjeta" de esqueleto para un efecto más dinámico */}
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
        ) : rows.length === 0 ? (
          <tr className={styles.tableRow}>
            <td
              colSpan={columns.length}
              className={styles.cell}
              style={{ textAlign: "center", padding: "20px" }}
            >
              <CellContent align="center">
                No hay datos para mostrar.
              </CellContent>
            </td>
          </tr>
        ) : (
          rows &&
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
