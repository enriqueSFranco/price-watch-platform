import type { PropsWithChildren } from 'react';
import styles from './card.module.css';
import { cn } from '@/lib/cn';

interface CardMediaProps {
	component?: 'img' | 'video' | 'picture';
	height?: string;
	src?: string;
	alt?: string;
}

export function CardMedia({ children, component = 'img', height, src, alt }: PropsWithChildren<CardMediaProps>) {
	const mediaClasses = cn(styles.cardMedia);

	const renderMedia = () => {
		if (children) {
			return children;
		}
		if (component === 'img' && src) {
			return (
				<picture>
					<source media="(max-width: 768px)" srcSet={src} />
					<source media="(max-width: 1200px)" srcSet={src} />
					<img src={src} alt={alt} style={{ height: `${height}px` }} className={styles.cardImage} />
				</picture>
			);
		}
		return null;
	};
	return <div className={mediaClasses}>{renderMedia()}</div>;
}
