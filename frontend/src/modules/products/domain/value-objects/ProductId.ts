import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class ProductId {
	private constructor(private readonly _value: string) {
		if (!this.uuidValidateV4(_value)) throw new Error(`Invalid UUID: ${_value}`);
	}

	static create() {
		return new ProductId(uuidv4());
	}

	get value() {
		return this._value;
	}

	static fromString(value: string) {
		return new ProductId(value);
	}

	private uuidValidateV4(value: string) {
		return uuidValidate(value);
	}
}
