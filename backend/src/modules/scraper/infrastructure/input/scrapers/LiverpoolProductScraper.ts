import type { Browser, Page } from "puppeteer";
import { ScraperErrors } from "../../../domain/exeptions/ScraperErrors.ts";
import { BaseProductScraper } from "./BaseProductScraper.ts";
import { Store } from "../../../domain/store.enums.ts";
import { AppError } from "../../../../../shared/utils/AppError.ts";
import { Result } from "../../../../../shared/utils/Result.ts";
import { HttpRequestManager } from "../puppeteer/HttpRequestManager.ts";
import { LIVERPOOL_SELECTORS } from "./selectors/liverpool.ts";

export type RawScrapedProduct = {
  name: string | null;
  rawPrice: string | null;
  rawDiscountPrice: string | null;
  url: string;
  imageUrl: string;
  inStock: boolean;
};

export class LiverpoolProductScraper extends BaseProductScraper {
  protected store = Store.Liverpool;

  constructor(
    protected readonly http: HttpRequestManager,
    protected readonly browser: Browser
  ) {
    super(http, browser);
  }

  private async extractName(page: Page): Promise<string | null> {
    const el = await page.$(LIVERPOOL_SELECTORS.product.title);
    if (!el) return null;

    const text = await page.$eval(LIVERPOOL_SELECTORS.product.title, (el) => {
      return el?.textContent?.trim() ?? null;
    });

    return text;
  }

  private async extractImageUrl(page: Page) {
    const imageUrl = await page
      .$eval(LIVERPOOL_SELECTORS.product.image, (el) => {
        const $image = el as HTMLImageElement;
        return $image.src || "N/A";
      })
      .catch(() => "N/A");

    return imageUrl;
  }

  private async extractPriceText(page: Page, selector: string) {
    return page
      .$eval(selector, (el) => el.textContent.trim() || "N/A")
      .catch(() => "N/A");
  }
  /**
   * @description Método de extracción principal. Solo extrae datos crudos y los retorna.
   * @returns Un objeto simple de datos crudos.
   */
  async extractProduct(
    page: Page,
    url: string
  ): Promise<Result<RawScrapedProduct>> {
    try {
      await page.waitForSelector(LIVERPOOL_SELECTORS.productDetailContainer);
      await this.http.setPageHeaders(page, url);

      await this.http.delay(100, 300);

      const results = await Promise.allSettled([
        this.extractName(page),
        this.extractImageUrl(page),
        this.extractPriceText(page, LIVERPOOL_SELECTORS.product.initialPrice),
        await this.extractPriceText(page, LIVERPOOL_SELECTORS.product.currentPrice),
      ]);

      const [nameResult, imageResult, initialPriceResult, currentPriceResult] =
        results;

      const productName =
        nameResult.status === "fulfilled" ? nameResult.value : "N/A";
      const imageUrl =
        imageResult.status === "fulfilled" ? imageResult.value : "N/A";
      const initialPrice =
        initialPriceResult.status === "fulfilled"
          ? initialPriceResult.value
          : "0.0";
      const currentPrice =
        currentPriceResult.status === "fulfilled"
          ? currentPriceResult.value
          : "0.0";

      const product = {
        name: productName ?? "Nombre no disponible",
        rawPrice: initialPrice,
        rawDiscountPrice: currentPrice,
        url,
        imageUrl,
        inStock: true,
      };

      return Result.success(product);
    } catch (error: any) {
      if (error instanceof AppError) return Result.error(error);
      return Result.error(ScraperErrors.UNKNOWN_SCRAPER_ERROR);
    }
  }
}
