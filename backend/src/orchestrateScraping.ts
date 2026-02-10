import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Store } from "./modules/scraper/domain/store.enums.ts";
import { ProductScraperService } from "./modules/scraper/application/services/ProductScraperService.ts";
import { BrowserManager } from "./modules/scraper/infrastructure/input/puppeteer/BrowserManager.ts";

const service = new ProductScraperService();

async function orchestrateScraping(storeArg: string, url: string | undefined) {
  console.log("[orchestrateScraping]");

  const validStore = storeArg as Store;

  if (!Object.values(Store).includes(validStore)) {
    throw new Error(
      `El e-commerce "${storeArg}" no es válido. Opciones: ${Object.values(
        Store
      ).join(", ")}`
    );
  }

  if (!url) throw new Error("La URL del producto no fue proporcionada.");

  try {
    const scraper = await service.create(validStore); // <-- ahora correcto
    const product = await scraper.run(url);

    console.log("[PRODUCT RESULT]");
    console.dir(product, { depth: 5 });
  } catch (error) {
    console.error("[Scraper ERROR]:", error);
    process.exit(1);
  }
}


async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option("Store", {
      alias: "e",
      demandOption: true,
      describe: "Nombre del e-commerce a scrapear...",
      type: "string",
    })
    .option("url", {
      alias: "u",
      describe: "URL de un producto en espcífico",
      type: "string",
    }).argv;

  const { Store, url } = argv;
  try {
    if (Store === "all") {
      console.info("Iniciando scraping para todos los e-commerce...");
      const allScrapers = Object.values(Store).map((shop) =>
        orchestrateScraping(shop, url)
      );
      await Promise.all(allScrapers);
    } else {
      await orchestrateScraping(Store, url);
    }
  } catch (e) {
  } finally {
    await BrowserManager.closeAll();
  }
}

main();
