import styles from "./cell-content.module.css";
import clsx from "clsx";

interface CellContentProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}

export function CellContent({ children, align = "left" }: CellContentProps) {
  return (
    <div
      className={clsx(
        "text-sm leading-tight px-2 py-1",
        {
          "text-left": align === "left",
          "text-center": align === "center",
          "text-right": align === "right",
        },
        styles.cellContent
      )}
    >
      {children}
    </div>
  );
}
