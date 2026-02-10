import type { Product } from '@/modules/products/domain/Product.schema';
import { ProductCard } from '../ui/molecules/ProductCard';
import { ProductActions } from '../ui/product-actions';
import { Table } from '@/components/ui/Table/Table';
import { Badge } from '@/components/desing-system/Badge/Badge';
import { useMemo } from 'react';

const MONITORING_STATUS_MAP = {
  active: { icon: '✅', variant: 'success', label: 'Monitoreando' },
  paused: { icon: '⏸️', variant: 'warning', label: 'Pausado' },
  error: { icon: '⚠️', variant: 'error', label: 'Error' },
} as const;

interface ProductTableProps {
	products: Product[];
	title: string;
	isLoading: boolean;
	onStopScraper: (id: string) => void;
}

export function ProductTable({ products, title = 'titulo de la tabla', isLoading, onStopScraper }: ProductTableProps) {
	const columns = useMemo(
		() =>
			(onStopScraper: (id: string) => void) => [
				{
					key: 'productInfo',
					header: 'Producto',
					renderCell: (p: Product) => <ProductCard product={p}  />,
				},
				{
					key: 'domain',
					header: 'Tienda electronica',
					renderCell: (p: Product) => <Badge label={p.store} color={'#09f'} />,
				},
				{
					key: 'initialPrice',
					header: 'Precio actual',
					renderCell: (p: Product) => {
						return new Intl.NumberFormat('es-MX', {
							style: 'currency',
							currency: 'MXN',
						}).format(p.currentPrice);
					},
				},
				{
					key: 'isMonitored',
					header: 'Monitoreo',
					renderCell: (p: Product) => {
						const statusData = MONITORING_STATUS_MAP[p.monitoringStatus as keyof typeof MONITORING_STATUS_MAP] || MONITORING_STATUS_MAP.error;
						return <Badge label={`${statusData.icon} ${p.monitoringStatus}`} variant={statusData.variant} />;
					},
				},
				{
					key: 'actions',
					header: 'Acciones',
					renderCell: (p: Product) => <ProductActions product={p} onStopScraper={onStopScraper} />,
				},
			],
		[],
	);

	return (
		<div className="bg-gray-900 rounded-xl">
			<Table
				summary="Lista de productos a monitorear"
				caption={title}
				columns={columns(onStopScraper)}
				rows={products}
				isLoading={isLoading}
			/>
		</div>
	);
}
