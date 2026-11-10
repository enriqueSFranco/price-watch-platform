import { PropsWithChildren } from 'react';
import { cn } from '@/lib/cn';
import styles from './card.module.css';

export function CardContent({ children }: PropsWithChildren) {
	const contentClasses = cn(styles.cardContent);
	return <div className={contentClasses}>{children}</div>;
}
