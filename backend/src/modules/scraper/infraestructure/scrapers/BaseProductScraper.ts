import { Browser, Page } from "puppeteer";
import { ScraperConfig } from "../../../../config/scraper.config";
import { blockUnwantedRequests } from "../utils/blockResources";
import { NetworkError } from "../../domain/errors/NetworkError";
import { ScraperData } from "../../domain/schemas/scraper.schema";
import { ScraperError } from "../../domain/errors/ScraperError";
import { Ecommerce } from "../ecommerce.enums";
import { HttpRequestManager } from "../http/HttpRequestManager";

export abstract class BaseProductScraper {
  protected abstract ecommerce: Ecommerce;

  constructor(
    protected readonly http: HttpRequestManager,
    protected readonly browser: Browser
  ) {}

  protected async setupPage(url: string): Promise<Page> {
    const context = this.browser.defaultBrowserContext();
    await context.overridePermissions(url, []);

    const page = await this.browser.newPage();
    await this.http.setPageHeaders(page);

    await blockUnwantedRequests(page, ScraperConfig.blockedResources);
    await page.setViewport({ width: 1366, height: 768 });

    return page;
  }

  protected async gotoWithRetries<T>(
    fn: () => Promise<T>,
    retries = 3,
    delayMs = 1000
  ): Promise<T> {
    const startTime = performance.now()
    const attemptErrors: Error[] = []

    for (let i = 0; i < retries; i++) {
      const attemptStart = performance.now()
      try {
        const result = await fn()
        const totalTime = (performance.now() - startTime).toFixed(2)
        console.info(
          `[gotoWithRetries] ✅ Success on attempt ${
            i + 1
          } after ${totalTime} ms`
        );
        return result;
      } catch (err) {
        const attemptTime = performance.now() - attemptStart;
        attemptErrors.push(err as Error)
        console.warn(
          `[gotoWithRetries] ❌ Attempt ${
            i + 1
          } failed after ${attemptTime} ms`,
          (err as Error).message
        );
        if (i === retries - 1) {
          const totalTime = (performance.now() - startTime).toFixed(2);
          console.error(
            `[gotoWithRetries] 💀 All ${retries} attempts failed after ${totalTime} ms`
          );
          throw new NetworkError(
            `Error al cargar la página tras ${retries} intentos`,
            err as Error
          );
        }
        const backoff = delayMs * Math.pow(2, i);
        console.info(`[gotoWithRetries] retrying in ${backoff}ms...`);
        await new Promise((res) => setTimeout(res, backoff));
      }
    }
    throw new Error("Max retries reached");
  }

  protected abstract extractProduct(page: Page, url: string): Promise<any>;

  public async run(url: string): Promise<ScraperData> {
    const start = performance.now();
    try {
      const page = await this.setupPage(url);
      await this.http.delay(500, 1_000);

      await this.gotoWithRetries(
        () =>
          page.goto(url, {
            waitUntil: "domcontentloaded",
          }),
        ScraperConfig.maxRetries
      );

      const end = performance.now();
      console.info(
        `[${this.ecommerce}Scraper] ✅ OK (${(end - start).toFixed(2)} ms)`
      );
      const product = await this.extractProduct(page, url);
      console.log(product);
      await page.close();

      return product;
    } catch (err) {
      throw new ScraperError(
        `Error en scraper de ${this.ecommerce}`,
        err as Error,
        { url }
      );
    }
  }
}
