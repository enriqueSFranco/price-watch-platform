import { formatMoney } from '@/core/utils/format';
import { ProductType } from '@/core/types/product';

interface Props {
	product: ProductType;
}

export function ProductDetails({ product }: Props) {
	// const {notificationRules} = product

	const productTranslations: { [key: string]: string } = {
		name: 'Nombre',
		status: 'Estado',
		domain: 'Dominio',
		currentPrice: 'Precio actual',
		lastCheckedAt: 'Última verificación',
		createdAt: 'Creado',
		imageUrl: 'Imagen',
	};
	return (
		<div className="col-span-8">
			<h3 className="text-2xl font-bold mb-4">Detalles del Producto</h3>
			<ul>
				{Object.entries(product).map(([key, value]) => {
					const translatedKey = productTranslations[key] || key;
					if (key === 'imageUrl') return null;
					if (key === 'notificationRules') return null;
					if (key === 'currentPrice') formatMoney(value);
					return (
						<li key={`${key}-${value}`}>
							<div className="flex items-center gap-2.5">
								<h2 className="text-sm font-light">{translatedKey}:</h2>
								<span>{value}</span>
							</div>
						</li>
					);
				})}
			</ul>
			<div>
				<h3 className="text-2xl font-bold mb-4">Reglas de Notificación</h3>
				<ol>
					{product.notificationRules.map((rule) => (
						<li key={`rule-${rule.id}`}>
							<div className="flex flex-col gap-1">
								<span>
									Tipo: <strong>{rule.type}</strong>
								</span>
								{/* Muestra el valor solo si existe */}
								{rule.value !== null && (
									<span>
										Valor: <strong>{rule.value}</strong>
									</span>
								)}
								<span>
									Estado: <strong>{rule.isActive ? 'Activa' : 'Inactiva'}</strong>
								</span>
							</div>
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}
