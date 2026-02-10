import { Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Store } from "../../domain/store.enums";

puppeteer.use(StealthPlugin());

export class BrowserManager {
  // Mapa de browsers para cada Store
  private static browsers = new Map<Store, Browser>(); // {Store_1: browser_1, Store_2: browser_2}

  static async getBrowser(
    Store: Store,
    headless: boolean = true
  ): Promise<Browser> {
    const existingBrowser = this.browsers.get(Store);
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
    this.browsers.set(Store, browser);
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
