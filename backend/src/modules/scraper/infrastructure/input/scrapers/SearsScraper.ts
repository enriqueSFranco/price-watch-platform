import type { Browser, Page } from "puppeteer";

const PRODUCT_URL_TEST =
  "https://www.sears.com.mx/producto/3603971/consola-playstation-5-con-astro-bot-y-gran-turismo-7";

export class SearsScraper {
  private async extractProductData(
    page: Page
  ){
    const productData = page.evaluate(() => {
    //   const mainContainerEle = document.querySelector(".sectionProduct");

    //   if (!mainContainerEle) return;

    //   const productContainerEle = mainContainerEle.querySelector(".container");
    //   const productImgEle = productContainerEle?.querySelector("#contImages");
    //   let imgSrc: string | undefined;
    //   if (productImgEle) {
    //     const pictureEle = productImgEle.querySelector("picture");
    //     const imgEle = pictureEle.querySelector("img") as HTMLImageElement;
    //     imgSrc = imgEle?.src || undefined;
    //   }
    //   return {
    //     imgSrc,
    //   };
    });
  }

  private async getPage(browser: Browser) {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    );
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
    return page;
  }

  // async run(
  //   productUrl: string = PRODUCT_URL_TEST
  // ): Promise<ExtractedProductData> {
  //   try {
  //   } catch (error) {}
  // }
}
