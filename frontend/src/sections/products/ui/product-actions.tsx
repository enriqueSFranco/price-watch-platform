import type { Product } from '@/modules/products/domain/Product.schema';
import { Button } from '@/components/desing-system/Button/button';
import { IconEdit } from '@/components/Icons/IcEdit';
import { IconPause } from '@/components/Icons/IcPause';
import { IconTrash } from '@/components/Icons/IcTrash';

interface ProductActionsProps {
	product: Product;
	onViewProduct?: (product: Product) => void;
	onUpdate?: (product: Product) => void;
	onDelete?: (id: string) => void;
	onStopScraper?: (id: string) => void;
}

export function ProductActions({ product, onViewProduct, onUpdate, onDelete, onStopScraper }: ProductActionsProps) {
	return (
		<nav className="flex items-center justify-between">
			{onViewProduct && (
				<Button variant="ghost" onClick={() => onViewProduct(product)}>
					<span className="text-xs font-light text-white">ver detalles</span>
				</Button>
			)}
			{onUpdate && (
				<Button color="secondary" variant="ghost" onClick={() => onUpdate(product)}>
					<IconEdit />
					<span className="text-xs font-light text-white">editar</span>
				</Button>
			)}

			{onDelete && (
				<Button color="error" variant="ghost" onClick={() => onDelete(product.id)}>
					<IconTrash />
					<span className="text-xs font-light text-white">eliminar</span>
				</Button>
			)}
			{onStopScraper && (
				<Button color="error" variant="ghost" onClick={() => onStopScraper(product.id)}>
					<IconPause />
					<span className="text-xs font-light text-white">dejar de monitoreo</span>
				</Button>
			)}
		</nav>
	);
}
