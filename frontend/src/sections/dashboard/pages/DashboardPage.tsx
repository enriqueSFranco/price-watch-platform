'use client';

import { useCallback, useState } from 'react';
import PriceChart from '@/sections/price-history/components/PriceChart';
import priceHistoryMock from '@/__mocks__/price-history.json';
import { StatsCard } from '../components/StatsCard';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { ProductTable } from '@/sections/products/components/ProductTable';
import { Colors } from '@/constants/colors';
import { useGetProductsQuery } from '@/sections/products/hooks/use-get-products-query';

export function DashboardPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const { data: products, error, isLoading } = useGetProductsQuery(undefined);

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	const handleStopScraper = useCallback((id: string) => {
		// Lógica de mutación simulada
		console.log(`[ACTION] Solicitud para detener el monitoreo del producto ID: ${id}`);
		alert(`Se ha solicitado detener el monitoreo del ID: ${id}`); // Usamos alert() para simular una notificación (aunque no recomendado)
	}, []);

	if (error) {
		const errorMessage = 'Ocurrió un error al cargar los productos.';
		console.error(error);
		return (
			<div className="text-center p-10 bg-red-900/50 text-red-300 rounded-xl border border-red-700">
				<h2 className="text-xl font-bold">Error de Carga</h2>
				<p>{errorMessage}</p>
				<p>Detalles: {JSON.stringify(error)}</p>
			</div>
		);
	}

	const stats = [
		{ title: 'Total productos', value: 3, color: Colors.brandPrimary, icon: '📦' },
		{ title: 'Activos', value: 3, color: Colors.success, icon: '✅' },
		{ title: 'Pausados', value: 0, color: Colors.warning, icon: '⏸️' },
		{ title: 'Errores', value: 0, color: Colors.error, icon: '⚠️' },
	];
	const productsToDisplay = products || [];

	return (
		<div className="grid min-h-screen grid-cols-1 lg:grid-rows-[auto_auto_1fr] gap-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
				{' '}
				{stats.map((stat) => (
					<StatsCard key={`stat-${stat.title}`} stat={stat} />
				))}
			</div>

			<div className="p-4 sm:p-6 rounded-xl shadow-lg mb-6">
				{' '}
				<h3 className="text-xl font-semibold mb-3">Historial de Precios - Tendencia General</h3>
				<div className="min-h-[300px] w-full">
					{' '}
					<PriceChart data={priceHistoryMock} />
				</div>
			</div>

			<div className="flex flex-col overflow-hidden">
					<ProductTable
						title="Productos Monitoreados Recientemente"
						products={productsToDisplay}
						isLoading={isLoading}
						onStopScraper={handleStopScraper}
					/>
	

				<Pagination currentPage={currentPage} totalPages={3} onPageChange={handlePageChange} />
			</div>
		</div>
	);
}
