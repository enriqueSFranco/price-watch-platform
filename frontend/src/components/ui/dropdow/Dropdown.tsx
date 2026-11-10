interface DropdownItem {
	label: string;
	action?: () => void;
}

interface DropwdownProps {
	trigger: React.ReactNode;
	items: DropdownItem[];
}

export function Dropdown({ trigger, items }: DropwdownProps) {
	return (
		<div>
			<div>
				{/* disparador para abrir o cerrar el dropdown */}
				{/* TODO: Implementar el outside click para cerrar el dropdown */}
				{trigger}
			</div>
			{/* items a mostrar por el dropdopwn */}
			<div>
				<ol>
					{items.map((item) => (
						<li key={`dropdown-item-${item.label}`}>
							<div>{item.label}</div>
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}
