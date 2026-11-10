interface TextCellProps {
	text: string | number;
	ariaLabel?: string;
}

export function TextCell({ text, ariaLabel }: TextCellProps) {
	return <span aria-label={ariaLabel}>{text}</span>;
}
