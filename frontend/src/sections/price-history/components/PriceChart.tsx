'use client';

import { cn } from '@/lib/cn';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title } from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

interface ChartData {
	date: string;
	price: number;
}

interface PriceChartProps {
  data: ChartData[];
  lastUpdated?: string;
  className?: string;
}

function PriceChart({ data, lastUpdated, className }: PriceChartProps) {
	const labels = data.map((point) => point.date);
	const prices = data.map((point) => point.price);

	const chartData = {
		labels,
		datasets: [
			{
				label: 'Precio',
				data: prices,
				borderColor: '#fff',
				backgroundColor: '#2E2E2E',
				tension: 0.3,
				fill: true,
			},
		],
	};

	const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffff',
          font: { weight: '500', size: 12 },
        },
      },
      title: {
        display: true,
        text: 'Histórico de precios',
        color: '#ffff',
        font: { size: 16, weight: '600' },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'var(--text-primary)',
        titleColor: '#fff',
        bodyColor: 'var(--text-inverted)',
        padding: 8,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: { display: false, color: '#fff' },
        ticks: { color: '#fff', maxRotation: 0, minRotation: 0 },
      },
      y: {
        grid: { color: '"var(--border-color)"' },
        ticks: {
          color: '#fff',
          callback: function(value: any) {
            return new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
              maximumSignificantDigits: 3, // Opcional: para mantenerlo limpio
            }).format(value);
          }
        },
      },
    },
  };

	return (
		<div
      className={cn(
        'shadow-md rounded-xl p-4 flex flex-col w-full h-[300px]',
        'bg-[var(--surface-1)] shadow-[var(--shadow-card)]',
        className
      )}
    >
      <div className="flex-1">
        <Line data={chartData} options={options} />
      </div>
      {lastUpdated && (
        <span className="mt-2 text-xs font-light text-[var(--text-tertiary)]">
          Última actualización: {lastUpdated}
        </span>
      )}
    </div>
	);
}

export default PriceChart;
