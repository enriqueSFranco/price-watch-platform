import { ProductPrice } from "../../products/domain/value-objects/ProductPrice";
import { Store } from "../infrastructure/store.enums";
import { ScrapedProductURL } from "./value-objects/ScrapedProductURL";

export class ScrapedProductEntity {
  constructor(
    public readonly name: string,
    public price: ProductPrice,
    public readonly url: ScrapedProductURL,
    public readonly provider: Store,
    public readonly imageUrl: string,
    public inStock: boolean,
    public scrapedAt: Date
  ) {
    if (!name) throw new Error("Product name is required");
  }
  get Name() {
    return this.name;
  }

  get ImageUrl() {
    return this.imageUrl;
  }

  get InStock() {
    return this.inStock;
  }

  get ScrapedAt() {
    return this.scrapedAt;
  }

  public static create(input: {
    name: string;
    price: ProductPrice;
    url: ScrapedProductURL;
    provider: Store;
    imageUrl: string;
    inStock: boolean;
    scrapedAt: Date;
  }) {
    return new ScrapedProductEntity(
      input.name,
      input.price,
      input.url,
      input.provider,
      input.imageUrl,
      input.inStock,
      input.scrapedAt
    );
  }
}
