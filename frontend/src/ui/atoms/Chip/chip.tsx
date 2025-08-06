import { getContrastingTextColor } from "@/lib/color";
import styles from "./chip.module.css";
import clsx from "clsx";

// type ChipStatus = "default" | "primary" | "success" | "warning" | "error" | "info" | "disabled"
interface ChipProps {
  text: string;
  bgColor?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function Chip({ text, bgColor="#e0e0e0", startIcon, endIcon }: ChipProps) {
  const textColor = getContrastingTextColor(bgColor);

  return (
    <div style={{ backgroundColor: bgColor, color: textColor }} className={clsx(styles.chip)}>
      {startIcon && startIcon}
      <span className={styles.chipText}>{text}</span>
      {endIcon && endIcon}
    </div>
  );
}
