'use client';

// import {
//   useEditProductMutation,
//   useSearchProductsQuery,
// } from "@/sections/Products/states/products.api";
import styles from './dashboard.module.css';
import { DashboardPage } from '@/sections/dashboard/pages/DashboardPage';

export default function Page() {
	// const searchParams = useSearchParams();
	// const router = useRouter();

	const handleStopScraper = () => {};

	const handlePageChange = (page: number) => {
		// const newSearchParams = new URLSearchParams(searchParams.toString());
		// newSearchParams.set('page', page.toString());
		// router.push(`?${newSearchParams.toString()}`);
	};

	return (
		<div className="h-full flex flex-col relative p-3">
			<DashboardPage />
		</div>
	);
}

/**
Dashboard
Objetivo: Vista general de métricas y actividad reciente.
Qué mostrar en UI:
  x Total productos monitorizados
  x Productos activos / pausados / con errores
  x Gráficas de precios vs tiempo
  -Últimos productos scrapeados
  -Alertas o notificaciones de fallos de scraping

Componentes UI sugeridos:
  -Cards resumen (estadísticas)
  -Charts (Recharts / ApexCharts / Tailwind Charts)
  -Tabla con últimas acciones o productos
  -Skeleton loader mientras carga
 */
