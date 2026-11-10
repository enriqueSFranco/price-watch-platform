import { cn } from '@/lib/cn';

interface CellContentProps {
	children: React.ReactNode;
	align?: 'left' | 'center' | 'right';
}

export function CellContent({ children, align = 'left' }: CellContentProps) {
	return (
		<div
			className={cn('text-sm leading-snug', {
				'text-left': align === 'left',
				'text-center': align === 'center',
				'text-right': align === 'right',
			})}
		>
			{children}
		</div>
	);
}
