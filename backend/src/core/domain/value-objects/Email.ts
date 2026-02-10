export class Email {
  private constructor(private readonly value: string) {
    if(!this.isValid(value)) throw new Error(`Invalid email: ${value}`);
  }

  static create(value: string) {
    return new Email(value.trim())
  }

  get Value() {
    return this.value
  }

  private isValid(value: string) {
    const regex = new RegExp(
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    );
    return regex.test(value)
  }
}
