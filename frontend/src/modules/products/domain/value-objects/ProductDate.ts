export class ProductDate {
	constructor(private readonly value: number) {}

	get raw() {
		return this.value;
	}

	get formatDate() {
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};

		const formatter = new Intl.DateTimeFormat('es-MX', options);
		const parsedFormatter = parseInt(formatter.format(this.value));
		return parsedFormatter;
	}
}
