import type { Browser, ElementHandle, Page } from "puppeteer";
import { Store } from "../../../domain/store.enums.ts";
import { BaseProductScraper } from "./BaseProductScraper.ts";
import { HttpRequestManager } from "../puppeteer/HttpRequestManager.ts";

export class AmazonProdcutScraper extends BaseProductScraper {
  constructor(
    protected readonly http: HttpRequestManager,
        protected readonly browser: Browser
  ) {
    super(http, browser)
  }
  private async getPage(browser: Browser) {
    const page = await browser.newPage();
    await this.requestManager.setPageHeaders(page);

    await page.setViewport({ width: 1366, height: 768 });

    page.on("console", (msg) => {
      const type = msg.type();
      const text = msg.text();

      switch (type) {
        case "error":
          console.error(`[NAVEGADOR] ${text}`);
          break;
        case "warn":
          console.warn(`[NAVEGADOR] ${text}`);
          break;
        default:
          console.debug(`[NAVEGADOR] ${text}`);
          break;
      }
    });
    return page;
  }

  private async extractProductPrice(
    element: ElementHandle<Element>
  ): Promise<PriceData | null> {
    if (!element) return null;
    try {
      const priceContainer = await element.$(
        "#corePriceDisplay_desktop_feature_div"
      );
      if (!priceContainer) return null;

      const currentPriceEl = await priceContainer.$(".priceToPay");
      if (!currentPriceEl) return null;

      // --- precio actual ---
      const wholePartText = await currentPriceEl
        .$eval(".a-price-whole", (node) => node.textContent)
        .then(() => "");
      const fractionPartText = await currentPriceEl
        .$eval(".a-price-fraction", (node) => node.textContent)
        .then(() => "");
      const normalizedCurrent = `${wholePartText?.replace(/\D/g, "") ?? "0"}.${
        fractionPartText ?? "00"
      }`;
      const currentPrice = parsePriceLocal(normalizedCurrent);

      // --- precio de lista (tachado) ---
      const listPriceText = await priceContainer
        .$eval(".basisPrice .a-offscreen", (node) => node.textContent)
        .then(() => null);
      const listPrice = listPriceText
        ? parsePriceLocal(listPriceText ?? "")
        : null;

      // --- porcentaje de ahorro ---
      const discountText = await priceContainer
        .$eval(".savingsPercentage", (node) => node.textContent)
        .then(() => null);

      return {
        currentPrice,
        listPrice,
        offer: discountText,
      };
    } catch (error) {
      return null;
    }
  }

  private async extractProductName(element: ElementHandle<Element>) {
    const titleWrapper = await element.$("#title_feature_div");
    if (!titleWrapper) return null;

    const titleSection = await titleWrapper.$(".titleSection");
    if (!titleSection) return null;

    const titleContainer = await titleSection.$(".title");
    if (!titleContainer) return null;

    const titleText =
      titleContainer.$eval("#productTitle", (node) => node.textContent) ??
      "N/A";

    return titleText;
  }

  private async extractMainProductImage(element: ElementHandle<Element>) {
    if (!element) return null;

    const $imgWrapper = await element.$("#imageBlock_feature_div");

    const $layoutImgDesktop = await $imgWrapper?.$(
      "[data-csa-c-content-id='image-block-desktop']"
    );
    const $img = await $layoutImgDesktop?.$("#landingImage");
    if (!$img) return null;

    const imgSrc = (await $img.$("data-old-hires")) ?? $img.$("src");
    return imgSrc ?? null;
  }

  private async extractProductData(
    page: Page
  ): Promise<ExtractedProductData | null> {
    console.info("🔍 [AmazonScraper] Iniciando extracción de datos...");
    try {
      const $productWrapper = await page.$("#ppd");

      if (!$productWrapper) return null;

      const $centerCol = await $productWrapper.$("#centerCol");
      const $leftCol = await $productWrapper.$("#leftCol");
      if (!$centerCol || !$leftCol) return null;

      const results = await Promise.allSettled([
        this.extractProductName($centerCol),
        this.extractProductPrice($centerCol),
        this.extractMainProductImage($leftCol),
      ]);

      console.log("✅ PÁGINA: Extracción completada.");
      const productName =
        results[0].status === "fulfilled" &&
        typeof results[0].value === "string"
          ? results[0].value
          : "N/A";

      const currentPrice =
        results[1].status === "fulfilled" && isPriceData(results[1].value)
          ? results[1].value
          : { currentPrice: 0, listPrice: null, offer: null };

      const imgSrc =
        results[2].status === "fulfilled" &&
        typeof results[2].value === "string"
          ? results[2].value
          : null;

      console.log({
        name: productName,
        provider: Store.Amazon,
        currentPrice: currentPrice.currentPrice,
        initialPrice: currentPrice.currentPrice,
        currency: "MXN",
        image: imgSrc,
        inStock: null,
        lastScrapedAt: new Date(),
        createdAt: new Date(),
      });
      return {
        name: productName,
        productUrl: await page.url(),
        provider: Store.Amazon,
        currentPrice: currentPrice.currentPrice,
        initialPrice: currentPrice.currentPrice,
        currency: "MXN",
        image: imgSrc,
        inStock: null,
        lastScrapedAt: new Date(),
        createdAt: new Date(),
      };
    } catch (error: any) {
      console.error(`❌ [extractProductData] ERROR: ${error.message}`);
      throw new Error(
        "No se pudo extraer el producto. El DOM pudo haber cambiado"
      );
    }
  }

  async run(url: ProductUrl): Promise<ExtractedProductData> {
    console.log(`🚀 [AmazonScraper] Iniciando scraper para URL: ${url}`);

    const browser = await this.browserFactory();
    const page = await this.getPage(browser);

    try {
      const productUrlString = url.toString();
      await withRetries(() =>
        page.goto(productUrlString, {
          timeout: 60000,
          waitUntil: "domcontentloaded",
        })
      );

      await this.requestManager.delay(3000, 7000);

      const $submitButton = await page.$(
        'form[action*="validateCaptcha"] button[type="submit"]'
      );
      debugger;

      if ($submitButton) {
        await $submitButton.click();
        console.log("✅ Clic en el botón de continuar a compras.");
        await page.waitForNavigation({
          waitUntil: "networkidle2",
          timeout: 6000,
        });
      }

      console.info("📤 Iniciando extracción de datos del producto...");

      await page.setRequestInterception(true);
      page.on("request", (request) => {
        const resourceType = request.resourceType();
        const url = request.url();
        const blockedDomains = [
          "m.media-amazon.com",
          "images-na.ssl-images-amazon.com",
        ];

        if (
          (["image", "font"].includes(resourceType) ||
            url.includes("js?AUIClients"),
          blockedDomains.some((domain) => url.includes(domain)))
        ) {
          console.log("abortando request");
          request.abort();
        } else {
          request.continue();
        }
      });
      const product = await withRetries(
        async () => await this.extractProductData(page!)
      );

      if (product) {
        console.log("🎉 Producto extraído con éxito.");
        return product;
      } else {
        throw new Error(
          "El contenedor principal del producto no se encontró en la página."
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(
          `Error inesperado al ejecutar el scraper: ${error.message}`
        );
      }
      throw new Error("Error desconocido al ejecutar el scraper.");
    } finally {
      if (browser) {
        console.log("🧹 Cerrando navegador...");
        await browser.close();
        console.log("👋 Navegador cerrado.");
      }
    }
  }
}
