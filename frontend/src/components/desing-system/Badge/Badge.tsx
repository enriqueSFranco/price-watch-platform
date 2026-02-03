import { cn } from '@/lib/cn';
import styles from './badge.module.css';

interface BadgeProps {
	label: string;
	variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'custom';
	color?: string;
}

export function Badge({ label, variant = 'info', color }: BadgeProps) {
	const style =
		variant === 'custom' && color
			? ({ '--badge-color': `${color}22`, '--badge-text': color } as React.CSSProperties)
			: undefined;

	return (
		<span
			aria-label={label}
			className={cn(styles.badge, styles[variant])}
			style={style}
		>
			{label}
		</span>
	);
}
