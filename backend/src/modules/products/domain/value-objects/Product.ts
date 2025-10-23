import { Ecommerce } from "../../../scraper/infraestructure/ecommerce.enums.ts";
import { ProductMonitoringStatus } from "../../infraestructure/product-monitoring.enum.ts";
import { ProductUrl } from "./ProductUrl.ts";

export class Product {
  constructor(
    private readonly id: string,
    private readonly url: ProductUrl,
    private readonly provider: Ecommerce | null,
    private name: string,
    private readonly imageUrl: string,
    private currentPrice: number,
    private readonly initialPrice: number,
    private inStock: boolean,
    private readonly monitoringStatus: ProductMonitoringStatus,
    private lastScrapedAt: Date
  ) {}

  get Id(): string {
    return this.id;
  }
  get Name(): string {
    return this.name;
  }
  get Url(): ProductUrl {
    return this.url;
  }
  get CurrentPrice(): number {
    return this.currentPrice;
  }
  static create(
    id: string,
    url: ProductUrl,
    provider: Ecommerce | null,
    name: string,
    imageUrl: string,
    currentPrice: number,
    initialPrice: number,
    inStock: boolean,
    monitoringStatus: ProductMonitoringStatus,
    lastScrapedAt: Date
  ): Product {
    return new Product(
      id,
      url,
      provider,
      name,
      imageUrl,
      currentPrice,
      initialPrice,
      inStock,
      monitoringStatus,
      lastScrapedAt
    );
  }

  equals(other: Product): boolean {
    if (!(other instanceof Product)) return false;

    return (
      this.id === other.id &&
      this.name === other.name &&
      this.currentPrice === other.currentPrice &&
      this.url.equals(other.url) &&
      this.lastScrapedAt.getTime() === other.lastScrapedAt.getTime()
    );
  }
}
