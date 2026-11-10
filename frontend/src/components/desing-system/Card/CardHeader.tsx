import { PropsWithChildren } from 'react';
import styles from './card.module.css';

export function CardHeader({ children }: PropsWithChildren) {
	return <div className={styles.cardHeader}>{children}</div>;
}
