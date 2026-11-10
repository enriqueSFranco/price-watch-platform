import type { ScraperServicePort } from "../../application/ScrapedProduct.port";
import type { ScrapedProduct } from "../../domain/ScrapedProduct.schema";

export class HttpScraperServiceAdapter implements ScraperServicePort {
  constructor(private readonly baseUrl: string = "/api/scraper") {}

  async scrape(url: string): Promise<ScrapedProduct> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify({url}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) {
      throw new Error("Error scraping product");
    }
    const decode = await res.json()
    return decode
  }
}
