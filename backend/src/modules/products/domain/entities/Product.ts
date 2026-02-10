import { Id } from "../../../../core/domain/Id.ts";
import { Store } from "../../../scraper/domain/store.enums.ts";
import { ProductMonitoringStatus } from "../../infrastructure/product-monitoring.enum.ts";
import { ProductPrice } from "../value-objects/ProductPrice.ts";
import { ProductUrl } from "../value-objects/ProductUrl.ts";

export class Product {
  constructor(
    private readonly id: Id,
    private readonly userId: Id,
    private name: string,
    private currentPrice: ProductPrice,
    private readonly url: ProductUrl,
    private readonly provider: Store | null,
    private readonly imageUrl: ProductUrl,
    private inStock: boolean,
    private readonly monitoringStatus: ProductMonitoringStatus,
    private readonly createdAt: Date,
    private initialPrice?: ProductPrice
  ) {}

  get Id(): Id {
    return this.id;
  }
  get UserId(): Id {
    return this.userId;
  }
  get Name(): string {
    return this.name;
  }
  get Url(): ProductUrl {
    return this.url;
  }
  get CurrentPrice(): ProductPrice {
    return this.currentPrice;
  }
  get InitialPrice(): ProductPrice {
    if (!this.initialPrice) return ProductPrice.create(0.0);
    return this.initialPrice;
  }
  get Provider(): Store | null {
    return this.provider;
  }
  get ImageUrl(): ProductUrl {
    return this.imageUrl;
  }
  get InStock(): boolean {
    return this.inStock;
  }
  get MonitoringStatus(): ProductMonitoringStatus {
    return this.monitoringStatus;
  }

  static create(props: {
    id?: string;
    userId: string;
    name: string;
    currentPrice: number;
    url: string;
    provider: Store;
    imageUrl: string;
    inStock: boolean;
    monitoringStatus: ProductMonitoringStatus;
    createdAt?: Date;
  }): Product {
    return new Product(
      Id.create(),
      Id.create(),
      props.name,
      ProductPrice.create(props.currentPrice),
      ProductUrl.create(props.url),
      props.provider,
      ProductUrl.create(props.imageUrl),
      props.inStock,
      props.monitoringStatus,
      props.createdAt ?? new Date(),
      ProductPrice.create(props.currentPrice)
    );
  }

  equals(other: Product): boolean {
    if (!(other instanceof Product)) return false;

    return (
      this.id === other.id &&
      this.name === other.name &&
      this.currentPrice === other.currentPrice
    );
  }
}
