import type { Product } from '@/modules/products/domain/Product.schema';
import { cn } from '@/lib/cn';
import styles from './product-card.module.css';
import { Card } from '@/components/desing-system/Card/Card';
import { CardContent } from '@/components/desing-system/Card/CardContent';
import { CardMedia } from '@/components/desing-system/Card/CardMedia';

interface ProductCardProps {
	product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
	const { name, imageUrl } = product;
	return (
		<Card orientation="vertical" aria-label={`Información del producto ${name}`}>
			<CardContent>
				<CardMedia component="img" src={imageUrl} alt={`Imagen del producto ${name}`} />
				<figcaption className="min-w-0 flex-1">
					<span className={cn('block', styles.productName)}>{name}</span>
				</figcaption>
			</CardContent>
		</Card>
	);
}
