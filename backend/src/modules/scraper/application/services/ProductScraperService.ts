import { Store } from "../../domain/store.enums.ts";
import { LiverpoolProductScraper } from "../../infrastructure/input/scrapers/LiverpoolProductScraper.ts";
// import { AmazonScraper } from "../../infrastructure/scrapers/AmazonScraper.ts";
import { ScraperErrors } from "../../domain/exeptions/ScraperErrors.ts";
import { IScraperFactoryPort } from "../ports/IScraperFactoryPort.ts";
import { BaseProductScraper } from "../../infrastructure/input/scrapers/BaseProductScraper.ts";
import { HttpRequestManager } from "../../infrastructure/input/puppeteer/HttpRequestManager.ts";
import { BrowserManager } from "../../infrastructure/input/puppeteer/BrowserManager.ts";

export class ProductScraperService implements IScraperFactoryPort {
  async create(store: Store): Promise<BaseProductScraper> {
    const http = new HttpRequestManager();
    const browser = await BrowserManager.getBrowser(store);

    switch (store) {
      case Store.Liverpool:
        return new LiverpoolProductScraper(http, browser);
      // case Store.Amazon:
      //   return "scraper amazon";
      default:
        throw ScraperErrors.UNSUPPORTED_STORE;
    }
  }
}
