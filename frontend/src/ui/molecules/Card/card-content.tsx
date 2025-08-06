import clsx from "clsx"
import styles from "./card.module.css"

export function CardContent({children}: {children: React.ReactNode}) {
  const contentClasses = clsx(styles.cardContent);
    return <div className={contentClasses}>{children}</div>;
}
