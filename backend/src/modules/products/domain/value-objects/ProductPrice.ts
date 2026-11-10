export class ProductPrice {
  private constructor(private readonly value: number) {
    if (isNaN(value) || value <= 0) {
      throw new Error("Invalid product price: must be a positive number");
    }
  }

  public static create(value: number | string): ProductPrice {
    const numeric = typeof value === "string" ? this.parsePriceLocal(value) : value;
    if (isNaN(numeric)) throw new Error("Price must be numeric");
    return new ProductPrice(numeric);
  }

  public get Value(): number {
    return this.value;
  }

  public equals(other: ProductPrice): boolean {
    return this.value === other.value;
  }

  private static parsePriceLocal(text: string): number {
    let cleaned = text.replace(/[^0-9.,]/g, "");
    if (cleaned.includes(",") && cleaned.includes(".")) {
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    } else if (cleaned.includes(",")) {
      cleaned = cleaned.replace(",", ".");
    }
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
}
