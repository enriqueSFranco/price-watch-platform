'use client';
import dynamic from 'next/dynamic';

interface ChartData {
	date: string;
	price: number;
}

interface Props {
	data: ChartData[];
	lastUpdated?: string;
}

const PriceChart = dynamic<React.FC<Props>>(() => import('./PriceChart'), {
	ssr: false,
	loading: () => (
		<div className="bg-white shadow-md rounded-xl p-4 w-full h-[300px] flex items-center justify-center text-gray-400 animate-pulse">
			Cargando gráfico...
		</div>
	),
});

const PriceChartClient = ({ data, lastUpdated }: Props) => {
	return <PriceChart data={data} lastUpdated={lastUpdated} />;
};

export default PriceChartClient;
