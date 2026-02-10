export class ProductUrl {
  constructor(private readonly value: string) {
    if (!this.isValidUrl("https")) throw new Error("Invalid product URL");
  }
  public static create(value: string): ProductUrl {
    return new ProductUrl(value);
  }

  public get Value(): string {
    return this.value;
  }

  public equals(other: ProductUrl): boolean {
    return this.value === other.value;
  }

  private isValidUrl(value: string): boolean {
    try {
      const protocol = new URL(value).protocol
      return protocol === 'https:' || protocol === 'http:'
    } catch {
      return false;
    }
  }
}
