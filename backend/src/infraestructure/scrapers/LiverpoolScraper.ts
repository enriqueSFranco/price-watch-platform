import type { Browser, Page } from "puppeteer";
import { launchStealthBrowser } from "../../services/browser";
import { parsePriceLocal, withRetries } from "../../utils";
import { IScraper, ProductType } from "../types";
import { liverpool } from "./selectors/liverpool";

export class LiverpoolScraper implements IScraper<ProductType> {
  private async getPage(browser: Browser): Promise<Page> {
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
        // --- INICIO DE LA LÓGICA PARA parsePriceLocal EN EL CONTEXTO DEL NAVEGADOR ---
        // Debes replicar o simplificar aquí la lógica de tu función parsePriceLocal
        // Si es compleja, considera pasarla como argumento o reestructurar.
        const parsePriceLocal = (priceText: string): number => {
          // Ejemplo simplificado: elimina el signo de peso y comas, luego convierte a número.
          // Ajusta esta lógica para que coincida con tu función original `parsePriceLocal`
          if (!priceText) return 0;
          let cleanedPrice = priceText.replace(/[$,]/g, "").trim();
          // También manejar casos con "MX$" u otras monedas si aplica
          cleanedPrice = cleanedPrice.replace("MX$", "").trim();
          return parseFloat(cleanedPrice);
        };
        // --- FIN DE LA LÓGICA PARA parsePriceLocal EN EL CONTEXTO DEL NAVEGADOR ---


        console.log("🧠 PÁGINA: Ejecutando lógica de extracción...");

        const productDetail = document.querySelector(selectors.PRODUCT_DETAIL);
        console.log(
          `📦 productDetail (${selectors.PRODUCT_DETAIL}) encontrado: ${!!productDetail}`
        );

        if (!productDetail) {
          console.log("❌ PÁGINA: productDetail no encontrado. Abortando.");
          return null;
        }

        const descriptionContainer = productDetail.querySelector(
          selectors.HEADER_SECTION.DESCRIPTION
        );
        console.log(
          `📝 descriptionContainer (${selectors.HEADER_SECTION.DESCRIPTION}) encontrado: ${!!descriptionContainer}`
        );

        const headerContainer = descriptionContainer?.querySelector(
          ".product-header-container"
        );

        const productNameEle = headerContainer?.querySelector(
          selectors.HEADER_SECTION.TITLE
        );
        const productName = productNameEle?.textContent?.trim() || "N/A";
        console.log(`🏷️ Nombre del producto: '${productName}'`);

        const productPriceEle = descriptionContainer?.querySelector(
          selectors.HEADER_SECTION.PRICE
        );

        let currentPrice = 0;
        if (productPriceEle) {
          let priceText = productPriceEle.textContent?.trim() || "";
          // AHORA parsePriceLocal está definido dentro de este scope
          currentPrice = parsePriceLocal(priceText);
          console.log(`💲 Precio extraído: ${currentPrice}`);
        } else {
          console.log("⚠️ Elemento de precio no encontrado.");
        }

        const productImage = productDetail?.querySelector(
          selectors.IMAGE_SECTION.PRODUCT_IMAGE
        );

        let imgSrc: string | undefined;
        if (productImage) {
          const imageEle = productImage.querySelector(
            selectors.IMAGE_SECTION.IMAGE
          ) as HTMLImageElement;
          imgSrc = imageEle?.src || undefined;
          console.log(`🌄 Imagen del producto: ${imgSrc || "N/A"}`);
        } else {
          console.log("⚠️ Carrusel de imágenes no encontrado.");
        }

        console.log("✅ PÁGINA: Extracción completada.");

        return {
          id: crypto.randomUUID(),
          name: productName,
          currentPrice,
          imageUrl: imgSrc,
        };
      }, liverpool); // liverpool (selectors) se pasa correctamente aquí

      console.log("📦 [extractProductData] Datos extraídos correctamente:");
      console.log(JSON.stringify(productData, null, 2));

      return productData;
    } catch (error: any) {
      console.error(
        `❌ [extractProductData] ERROR: ${error.message}`
      );
      throw new Error(`No se pudo extraer el elemento: ${error.message}`);
    }
  }

  async run(productUrl: string): Promise<ProductType | null> {
    console.log(`🚀 [LiverpoolScraper] Iniciando scraper para URL: ${productUrl}`);

    let browser: Browser | undefined;
    let page: Page | undefined;

    try {
      browser = await launchStealthBrowser();
      page = await this.getPage(browser);

      console.log(`🌐 Navegando a: ${productUrl}`);

      await withRetries(async () =>
        page!.goto(productUrl, { timeout: 60000, waitUntil: "networkidle2" })
      );

      console.log("✅ Navegación completada con éxito.");

      console.log(`⏳ Esperando selector: ${liverpool.PRODUCT_DETAIL}`);
      await page!.waitForSelector(liverpool.PRODUCT_DETAIL, { timeout: 15000 });
      console.log("📌 Selector principal encontrado.");

      console.log("📤 Iniciando extracción de datos del producto...");
      const product = await withRetries(async () =>
        this.extractProductData(page!)
      );

      if (product) {
        console.log("🎉 Producto extraído con éxito.");
        return product;
      } else {
        console.warn("⚠️ Extracción retornó null.");
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

// const liverpoolScreaperTest = new LiverpoolScraper()
// liverpoolScreaperTest.run()

// TODO: Evitar bloqueos y deteccion npm install puppeteer-extra puppeteer-extra-plugin-stealth
// https://assetspwa.liverpool.com.mx/assets/images/logos/liverpool-logo.svg
