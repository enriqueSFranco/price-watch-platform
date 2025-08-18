import { ProductMonitoringStatus } from "../../../db/schema";
import { EcommerceEnum } from "../../../infraestructure/scrapers/enums";
import { ProductUrl } from "./ProductUrl";

export class Product {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private name: string,
    private readonly productUrl: ProductUrl,
    private readonly provider: EcommerceEnum | null,
    private currentPrice: number,
    private readonly initialPrice: number,
    private readonly currency: string,
    private readonly image: string,
    private inStock: boolean,
    private readonly monitoringStatus: ProductMonitoringStatus,
    private lastScrapedAt: Date,
    private readonly createdAt: Date
  ) {}

  getId() {
    return this.id;
  }
  getUserId() {
    return this.userId;
  }
  getName() {
    return this.name;
  }
  getProductUrl() {
    return this.productUrl;
  }
  getInitialPrice() {
    return this.initialPrice;
  }
  getCurrentPrice() {
    return this.currentPrice;
  }
  getCurrency() {
    return this.currency;
  }
  getImage() {
    return this.image;
  }
  getInStock() {
    return this.inStock;
  }
  getMonitoringStatus() {
    return this.monitoringStatus;
  }
  getProvider() {
    return this.provider;
  }
  getLastScrapedAt() {
    return this.lastScrapedAt;
  }
  getCreatedAt() {
    return this.createdAt;
  }

  updateScrapedData(newPrice: number, newInStock: boolean) {
    this.currentPrice = newPrice;
    this.inStock = newInStock;
    this.lastScrapedAt = new Date();
  }

  changeName(newName: string) {
    this.name = newName;
  }
}
