import { cn } from '@/lib/cn';
import styles from './button.module.css';

type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	variant?: 'contained' | 'outlined' | 'ghost';
	color?: ButtonColor;
}

export function Button({ children, variant = 'contained', color = 'primary', ...rest }: ButtonProps) {
	const buttonClass = cn(styles.button, styles[`button--variant-${variant}`], styles[`button--color-${color}`]);

	return (
		<button {...rest} data-variant={variant} data-color={color} className={buttonClass}>
			{children}
		</button>
	);
}
