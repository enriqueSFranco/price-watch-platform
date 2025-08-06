import styles from "./card.module.css";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  size?: "small" | "medium" | "large";
  variant?: "default" | "outlined" | "elevated";
  brandColor?: string;
}

export function Card({
  children,
  size = "large",
  variant = "outlined",
  brandColor = "#ccc",
  orientation = "vertical",
}: CardProps) {
  const cardClasses = clsx(styles.card, styles[`card--${orientation}`], {
    [styles[`card--${size}`]]: size !== "medium",
    [styles[`card--${variant}`]]: variant !== "default",
  });

  const inlineStyle = brandColor ? { border: `2px solid ${brandColor}` } : undefined;

  return (
    <div className={cardClasses} style={inlineStyle}>
      {children}
    </div>
  );
}
