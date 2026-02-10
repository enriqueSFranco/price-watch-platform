'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';
import styles from './text-input.module.css';

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'outlined' | 'filled' | 'standard';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	description?: string;
	loading?: boolean;
	readOnly?: boolean;
	prefixIcon?: React.ReactNode;
	suffixIcon?: React.ReactNode;
	hasError?: boolean;
	isValid?: boolean;
	variant?: InputVariant;
	sx?: InputSize;
}

const sizeClasses = {
	sm: 'h-8 text-sm px-2 gap-2',
	md: 'h-10 text-base px-3 gap-3',
	lg: 'h-12 text-lg px-4 gap-4',
};

const variantClasses = {
	outlined: styles['input--outlined'],
	filled: styles['input--filled'],
	standard: styles['input--standard'],
};

const stateClasses = {
	error: styles['input--error'],
	valid: styles['input--valid'],
	disabled: styles['input--disabled'],
	focused: styles['input--focused'],
};

export function TextInput({
	label,
	description,
	loading,
	readOnly,
	prefixIcon,
	suffixIcon,
	hasError = false,
	isValid = false,
	variant = 'outlined',
	sx = 'md',
	...props
}: TextInputProps) {
	const inputHintId = useId();
	const descriptionId = useId();
	const [focused, setFocused] = useState(false);

	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		setFocused(true);
		if (props.onFocus) props.onFocus(e);
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setFocused(false);
		if (props.onBlur) props.onBlur(e);
	};

	return (
		<div
			className={cn(
				'flex flex-col gap-1 w-full relative',
				styles.wrapper,
				styles[`size-${sx}`],
				styles[`variant-${variant}`],
				hasError && 'has-error',
				isValid && 'is-valid',
				readOnly && 'readonly',
				loading && 'loading',
				(props.value || props.defaultValue) && 'filled',
			)}
		>
			<label htmlFor={inputHintId} className="text-sm font-medium text-[var(--text-secondary)]">
				{label}
			</label>
			<div
				className={cn(
					'flex items-center',
					styles.inputBase,
					sizeClasses[sx],
					variantClasses[variant],
					focused && stateClasses.focused,
					hasError && stateClasses.error,
					isValid && stateClasses.valid,
					prefixIcon && 'has-prefix',
					suffixIcon && 'has-suffix',
					props.disabled && stateClasses.disabled,
				)}
			>
				{prefixIcon && <span className={styles.prefix}>{prefixIcon}</span>}
				<input
					id={inputHintId}
					aria-invalid={hasError || undefined}
					aria-describedby={description ? descriptionId : undefined}
					disabled={props.disabled}
					autoComplete="off"
					readOnly={readOnly}
					placeholder=" "
					className={cn(styles.inputElement)}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					{...props}
				/>
				{suffixIcon && <span className={styles.suffix}>{suffixIcon}</span>}
			</div>
			{description && (
				<p id={descriptionId} className={cn(styles.description, hasError && styles.errorText)}>
					{description}
				</p>
			)}
		</div>
	);
}
