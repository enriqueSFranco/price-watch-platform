import { Card } from '@/components/desing-system/Card/Card';
import { CardContent } from '@/components/desing-system/Card/CardContent';
import { CardHeader } from '@/components/desing-system/Card/CardHeader';

type Stat = { title: string, value: number, color: string, icon: string }

interface StatsCardProps {
  stat: Stat
}

export function StatsCard({ stat }: StatsCardProps) {
	return (
		<Card orientation="vertical">
			<CardHeader>
				<h2 style={{ color: stat.color }} className="text-md font-medium">
					{stat.title}
				</h2>
			</CardHeader>
			<CardContent>
				<h3 style={{ color: stat.color }} className="text-xl font-bold">
					{stat.value}
				</h3>
			</CardContent>
		</Card>
	);
}
