interface Store {
	name: string;
	description: string;
	bgColor: `#${string}`;
}

export const supportedStores: Store[] = [
	{
		name: 'Liverpool',
		description:
			'Extraemos información completa del producto: nombre, imagen, precio, disponibilidad y descripción. Optimizado para detectar cambios de precio con precisión.',
		bgColor: '#e20098',
	},
	{
		name: 'Amazon',
		description:
			'Monitoreamos productos de Amazon con alta estabilidad, capturando datos clave como título, precio, historial de variaciones, imágenes y estado del vendedor.',
		bgColor: '#ff6200',
	},
	{
		name: 'Mercado Libre',
		description:
			'Seguimiento detallado de productos de Mercado Libre: precio actual, descuentos, vendedor, disponibilidad y cambios relevantes que afectan tu compra.',
		bgColor: '#ffe600',
	},
];
