import { ProductPrice } from "../../products/domain/value-objects/ProductPrice";
import { Store } from "./store.enums";
import { ScrapedProductURL } from "./value-objects/ScrapedProductURL";

export class ScrapedProductEntity {
  constructor(
    public readonly name: string,
    public price: ProductPrice,
    public discountPrice: ProductPrice,
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

  get DiscountPrice() {
    return this.discountPrice
  }

  get ScrapedAt() {
    return this.scrapedAt;
  }

  public static create(input: {
    name: string;
    price: ProductPrice;
    discountPrice: ProductPrice;
    url: ScrapedProductURL;
    provider: Store;
    imageUrl: string;
    inStock: boolean;
    scrapedAt: Date;
  }) {
    const {
      name,
      price,
      discountPrice,
      url,
      provider,
      imageUrl,
      inStock,
      scrapedAt,
    } = input;
    return new ScrapedProductEntity(
      name,
      price,
      discountPrice,
      url,
      provider,
      imageUrl,
      inStock,
      scrapedAt
    );
  }
}
