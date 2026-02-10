import { Browser, Page } from "puppeteer";
import { blockUnwantedRequests } from "../../utils/blockResources";
import { ScraperErrors } from "../../../domain/exeptions/ScraperErrors";
import { Store } from "../../../domain/store.enums";
import { ScraperConfig } from "./scraper-config";
import { Result } from "../../../../../shared/utils/Result";
import { ScrapedProductEntity } from "../../../domain/ScrapedProduct.entity";
import { AppError } from "../../../../../shared/utils/AppError";
import { ProductPrice } from "../../../../products/domain/value-objects/ProductPrice";
import { ScrapedProductURL } from "../../../domain/value-objects/ScrapedProductURL";
import { HttpRequestManager } from "../puppeteer/HttpRequestManager";

export type RawScrapedProduct = {
  name: string | null;
  rawPrice: string | null;
  rawDiscountPrice: string | null;
  url: string;
  imageUrl: string;
  inStock: boolean;
};

export abstract class BaseProductScraper {
  protected abstract store: Store;

  constructor(
    protected readonly http: HttpRequestManager,
    protected readonly browser: Browser
  ) {}

  /**
   * @description Inicializa la página de Puppeteer con viewport, headers y bloqueos
   * @param url URL del producto
   * @returns
   */
  protected async setupPage(url: string): Promise<Page> {
    const context = this.browser.defaultBrowserContext();
    await context.overridePermissions(url, []);

    const page = await this.browser.newPage();
    await this.http.setPageHeaders(page);

    await blockUnwantedRequests(page, ScraperConfig.blockedResources);
    await page.setViewport({ width: 1366, height: 768 });

    return page;
  }

  /**
   * @description Ejecuta la función fn() con reintentos backoff exponencial y logging.
   * Mide métricas de tiempo y logea cada intento.
   * @param fn Función que realiza la navegación
   * @param retries Número maximo de reintentos
   * @param delayMs Tiempo base de backoff
   */
  protected async gotoWithRetries<T>(
    fn: () => Promise<T>,
    retries = 3,
    delayMs = 1000
  ): Promise<T> {
    const startTime = performance.now();
    const attemptErrors: Error[] = [];

    for (let i = 0; i < retries; i++) {
      const attemptStart = performance.now();
      try {
        const result = await fn();
        const totalTime = (performance.now() - startTime).toFixed(2);
        console.info(
          `[gotoWithRetries] ✅ Success on attempt ${
            i + 1
          } after ${totalTime} ms`
        );
        return result;
      } catch (err) {
        const attemptTime = performance.now() - attemptStart;
        attemptErrors.push(err as Error);
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
          throw ScraperErrors.NETWORK_ERROR;
        }
        const backoff = delayMs * Math.pow(2, i);
        console.info(`[gotoWithRetries] retrying in ${backoff}ms...`);
        await new Promise((res) => setTimeout(res, backoff));
      }
    }
    throw ScraperErrors.NETWORK_ERROR;
  }

  /**
   * @description Extrae los datos de un producto. Implementado por cada scraper especifico
   * @param page Página de Puppeteer
   * @param url URL del producto
   */
  protected abstract extractProduct(
    page: Page,
    url: string
  ): Promise<Result<RawScrapedProduct>>;

  /**
   * @description Orquesta el flujo completo del scraping.
   * 1. Setup de página
   * 2. Navegación con retries
   * 3. Extracción del producto
   * 4. Cierre de página
   * @param url URL del producto
   */
  public async run(url: string): Promise<Result<ScrapedProductEntity>> {
    const start = performance.now();
    try {
      const page = await this.setupPage(url);
      await this.http.delay(100, 200);

      await this.gotoWithRetries(
        () =>
          page.goto(url, {
            waitUntil: "domcontentloaded",
          }),
        ScraperConfig.maxRetries
      );

      const end = performance.now();
      console.info(
        `[${this.store}Scraper] OK (${(end - start).toFixed(2)} ms)`
      );

      const extractResult = await this.extractProduct(page, url);
      await page.close();

      if (extractResult.isFailure()) {
        return Result.error(extractResult.Error!);
      }

      const scraped = extractResult.Value!;

      const scraperData = ScrapedProductEntity.create({
        name: scraped.name ?? "Nombre no disponible",
        price: ProductPrice.create(scraped.rawPrice ?? "0.0"),
        discountPrice: ProductPrice.create(scraped.rawDiscountPrice ?? "0.0"),
        url: ScrapedProductURL.create(scraped.url),
        provider: this.store,
        imageUrl: scraped.imageUrl,
        inStock: scraped.inStock,
        scrapedAt: new Date(),
      });

      console.log("[SCRAPED RESULT]", scraperData);
      return Result.success(scraperData);
    } catch (err) {
      if (err instanceof AppError) return Result.error(err);
      return Result.error(ScraperErrors.UNKNOWN_SCRAPER_ERROR);
    }
  }
}
