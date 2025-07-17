import styles from "./chip.module.css";
import clsx from "clsx";

type ChipStatus = "default" | "primary" | "success" | "warning" | "error" | "info" | "disabled"

interface ChipProps {
  text: string;
  status?: ChipStatus
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Chip({ text, status = "default", iconLeft, iconRight }: ChipProps) {
  return (
    <div data-status={status} className={clsx(styles.chip, { })}>
      {iconLeft && iconLeft}
      <span className={styles.chipText}>{text}</span>
      {iconRight && iconRight}
    </div>
  );
}
