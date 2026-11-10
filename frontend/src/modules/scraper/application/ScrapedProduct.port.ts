import type { ScrapedProduct } from "../domain/ScrapedProduct.schema";

export interface ScraperServicePort {
  scrape(url: string): Promise<ScrapedProduct>
}
