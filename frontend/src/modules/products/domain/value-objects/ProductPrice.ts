export class ProductPrice {
	constructor(
		private readonly val: number,
		private readonly currency: string,
	) {}

	get raw() {
		return this.val;
	}

	get formatted() {
		const options: Intl.NumberFormatOptions = {
			style: 'currency',
			currency: this.currency,
			maximumSignificantDigits: 2,
			maximumFractionDigits: 2,
			currencyDisplay: 'narrowSymbol',
			unitDisplay: 'short',
		};

		const formatter = new Intl.NumberFormat('es-MX', options);
		const parsedNumericFormatter = parseInt(formatter.format(this.val));
		return parsedNumericFormatter;
	}
}
