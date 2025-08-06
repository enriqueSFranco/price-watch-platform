import styles from "./card.module.css"

export function CardHeader({children}: {children: React.ReactNode}) {
  return (
    <div className={styles.cardHeader}>
      {children}
    </div>
  );
}
