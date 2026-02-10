import type { ScraperServicePort } from "./ScrapedProduct.port";

export class ScrapedProductUseCase {
  constructor(private readonly service: ScraperServicePort) {}

  async execute(url: string) {
    return await this.service.scrape(url)
  }
}
