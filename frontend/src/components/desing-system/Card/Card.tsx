import { PropsWithChildren } from 'react';
import { cn } from '@/lib/cn';
import styles from './card.module.css';

interface CardProps {
	orientation?: 'horizontal' | 'vertical';
	size?: 'small' | 'medium' | 'large';
	variant?: 'default' | 'outlined' | 'elevated';
	brandColor?: string;
	bgColor?: string;
}

export function Card({
	children,
	variant = 'outlined',
	orientation = 'vertical',
	brandColor,
	bgColor,
}: PropsWithChildren<CardProps>) {
	const classes = cn(
		styles.card,
		styles[`card--${variant}`],
		styles[`card--${orientation}`]
	);

	const inlineStyle: React.CSSProperties = {
		...(bgColor && { backgroundColor: bgColor }),
		...(brandColor && { borderColor: brandColor }),
	};

	return (
		<div className={classes} style={inlineStyle}>
			{children}
		</div>
	);
}

export function CardActionArea({ children, onClick }: PropsWithChildren<{ onClick?: () => void }>) {
	return (
		<button className={styles.cardActionArea} onClick={onClick}>
			{children}
		</button>
	);
}
