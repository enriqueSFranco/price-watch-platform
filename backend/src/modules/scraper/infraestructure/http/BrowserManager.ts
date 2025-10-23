import { Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Ecommerce } from "../ecommerce.enums";

puppeteer.use(StealthPlugin());

export class BrowserManager {
  // Mapa de browsers para cada ecommerce
  private static browsers = new Map<Ecommerce, Browser>(); // {ecommerce_1: browser_1, ecommerce_2: browser_2}

  static async getBrowser(
    ecommerce: Ecommerce,
    headless: boolean = true
  ): Promise<Browser> {
    const existingBrowser = this.browsers.get(ecommerce);
    if (existingBrowser) {
      return existingBrowser;
    }
    const browser = await puppeteer.launch({
      headless,
      devtools: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--disable-geolocation",
        "--disable-features=IsolateOrigins,site-per-process",
        "--window-size=1280,800",
      ],
      defaultViewport: { width: 1280, height: 800 },
    });
    this.browsers.set(ecommerce, browser);
    return browser;
  }
  /**
   * @description Cierra el navagor de Puppeteer
   */
  static async closeAll() {
    for (const browser of this.browsers.values()) {
      await browser.close();
    }
    this.browsers.clear();
  }
}
