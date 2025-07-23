import type { Browser, Page } from "puppeteer";
import { IScraper, ProductType } from "../types";
import { launchStealthBrowser } from "../../services/browser";
import { parsePriceLocal, withRetries } from "../../utils";
import { amazon } from "./selectors/amazon";

export class AmazonScraper implements IScraper<ProductType> {
  private async getPage(browser: Browser) {
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    );

    page.on("console", (msg) =>
      console.log("🧠 [PÁGINA] Log del navegador:", msg.text())
    );

    return page;
  }

  private async extractProductData(page: Page): Promise<ProductType | null> {
    console.log("🔍 [extractProductData] Iniciando extracción de datos...");

    try {
      const productData = await page.evaluate((selectors) => {
        const parsePriceLocal = (priceText: string): number => {
          if (!priceText) return 0;
          let cleanedPrice = priceText.replace(/[$,MXÑ€]/g, "").trim();
          cleanedPrice = cleanedPrice.replace(/\s+/g, '');
          cleanedPrice = cleanedPrice.replace('.', '');
          cleanedPrice = cleanedPrice.replace(',', '.');

          const parsed = parseFloat(cleanedPrice);
          return isNaN(parsed) ? 0 : parsed;
        };

        const mainContainer = document.querySelector(selectors.PRODUCT_DETAIL);
        if (!mainContainer) {
          console.log("❌ PÁGINA: mainContainer no encontrado. Abortando.");
          return null;
        }

        const centerCol = mainContainer.querySelector(
          selectors.LAYOUT.CENTER_COLUMN
        );

        // --- Extracción del Nombre ---
        const titleFeature = centerCol?.querySelector(
          "#title_feature_div"
        );
        const titleSection = titleFeature?.querySelector("#titleSection")
        const productNameH1 = titleSection?.querySelector("#title")
        const productNameText = productNameH1?.querySelector("#productTitle")?.textContent.trim() || "N/A"
        console.log(`🏷️ Nombre del producto: '${productNameText}'`);

        // --- Extracción del Precio ---
        let currentPrice = 0;
        const priceElement =
          centerCol?.querySelector("span.a-price-whole") ||
          centerCol?.querySelector("span.a-price span.a-offscreen") ||
          centerCol?.querySelector("span.priceToPay span.a-offscreen") ||
          centerCol?.querySelector(".a-color-price");

        if (priceElement) {
            let priceText = priceElement.textContent?.trim() || "";
            if (priceElement.classList.contains('a-price-whole')) {
                const fraction = centerCol?.querySelector("span.a-price-fraction")?.textContent?.trim() || "";
                priceText = priceText + fraction;
            }
            currentPrice = parsePriceLocal(priceText);
            console.log(`💲 Precio extraído: ${currentPrice}`);
        } else {
            console.log("⚠️ Elemento de precio no encontrado. Intentando con otras estructuras.");
            const corePriceDisplay =
                centerCol?.querySelector("#corePriceDisplay_desktop_feature_div") ||
                centerCol?.querySelector("#corePriceDisplay_mobile_feature_div");

            if (corePriceDisplay) {
                const fallbackPriceEle = corePriceDisplay.querySelector("span.aok-offscreen") ||
                                         corePriceDisplay.querySelector(".a-price-whole") ||
                                         corePriceDisplay.querySelector(".a-size-medium.a-color-price");
                if (fallbackPriceEle) {
                    let priceText = fallbackPriceEle.textContent?.trim() || "";
                    if (fallbackPriceEle.classList.contains('a-price-whole')) {
                        const fraction = corePriceDisplay.querySelector("span.a-price-fraction")?.textContent?.trim() || "";
                        priceText = priceText + fraction;
                    }
                    currentPrice = parsePriceLocal(priceText);
                    console.log(`💲 Precio extraído (fallback): ${currentPrice}`);
                }
            }
        }

        // --- Extracción de la Imagen ---
        const leftCol = mainContainer.querySelector(
          selectors.LAYOUT.LEFT_COLUMN
        );

        let imageUrl;
        const imgEle = leftCol?.querySelector("#imgTagWrapperId img#landingImage") as HTMLImageElement;

        if (imgEle) {
            imageUrl = imgEle.src || imgEle.getAttribute("data-a-dynamic-image");
            if (imageUrl && imageUrl.startsWith('{')) {
                try {
                    const dynamicImageJson = JSON.parse(imageUrl);
                    imageUrl = Object.keys(dynamicImageJson)[0];
                } catch (e) {
                    console.warn("⚠️ No se pudo parsear data-a-dynamic-image JSON.");
                    imageUrl = undefined;
                }
            }
        } else {
            console.log("⚠️ #landingImage no encontrado. Buscando otras imágenes principales.");
            const alternativeImgEle = leftCol?.querySelector("#imageBlock img") as HTMLImageElement;
            if (alternativeImgEle) {
                imageUrl = alternativeImgEle.getAttribute("src");
            }
        }

        console.log(`🌄 Imagen del producto: ${imageUrl || "N/A"}`);
        console.log("✅ PÁGINA: Extracción completada.");

        return {
          id: crypto.randomUUID(),
          name: productNameText,
          currentPrice,
          imageUrl,
        };
      }, amazon);

      console.log("📦 [extractProductData] Datos extraídos:");
      console.log(JSON.stringify(productData, null, 2));

      return productData || null;
    } catch (error: any) {
      console.error(`❌ [extractProductData] ERROR: ${error.message}`);
      throw new Error(`No se pudo extraer el elemento: ${error.message}`);
    }
  }
  async run(
    productUrl: string
  ): Promise<ProductType | null> {
    console.log(`🚀 [AmazonScraper] Iniciando scraper para URL: ${productUrl}`);

    let browser: Browser | undefined;
    let page: Page | undefined;

    try {
      browser = await launchStealthBrowser();
      page = await this.getPage(browser);

      console.log(`🌐 Navegando a: ${productUrl}`);
      await withRetries(() =>
        page!.goto(productUrl, { timeout: 60000, waitUntil: "domcontentloaded" })
      );
      console.log("✅ Navegación completada.");

      const continueButton = await page.$(
        'form[action*="validateCaptcha"] button[type="submit"]'
      );

      if (continueButton) {
        console.log("🛡️ CAPTCHA detectado. Haciendo clic en 'Continuar'...");
        await continueButton.click();
      }


      console.log("📤 Iniciando extracción de datos del producto...");
      await page.waitForSelector("#ppd", {timeout: 10000})
      const product = await withRetries(() => this.extractProductData(page!));

      if (product) {
        console.log("🎉 Producto extraído con éxito.");
        return product;
      } else {
        console.warn("⚠️ La extracción de datos retornó null.");
        return null;
      }
    } catch (error: any) {
      console.error(`💥 ERROR CRÍTICO: ${error.message}`);
      return null;
    } finally {
      if (browser) {
        console.log("🧹 Cerrando navegador...");
        await browser.close();
        console.log("👋 Navegador cerrado.");
      }
    }
  }
}
