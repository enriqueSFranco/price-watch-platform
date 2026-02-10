import { cn } from '@/lib/cn';
import styles from './title.module.css';

export function AppTitle() {
	return (
		<div className={cn(styles.wrapperTitle)}>
			<h2 className={styles.title}>Price Watch</h2>
		</div>
	);
}
