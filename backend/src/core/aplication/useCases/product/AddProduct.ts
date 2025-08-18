import { ProductMonitoringStatus } from "../../../../db/schema";
import { EcommerceEnum } from "../../../../infraestructure/scrapers/enums";
import { Product } from "../../../domain/products/Product";
import { ProductUrl } from "../../../domain/products/ProductUrl";
import { IProductRepository } from "../../../ports/repositories/IProductRepository";
import { IScraperFactory } from "../../../ports/scrapers/IScraperFactory";

export class AddProduct {
  constructor(private readonly prodcutRepository: IProductRepository, private readonly scraperFactory: IScraperFactory) {}

  async execute(userId: string, productUrl: ProductUrl): Promise<Product> {
    const provider = ProductUrl.getSiteFromUrl(productUrl.toString());

    if (!provider) {
      throw new Error(`Proveedor no soportado para la URL: ${productUrl}`);
    }
    // Paso 2: Usar la fabrica inyectada para obtener el scraper
    const scraper = this.scraperFactory.createScraper(provider);

    // Paso 3: Scrapear el producto
    const scrapedData = await scraper.run(productUrl);

    // Paso 4: Verificamos si no existe el producto
    const existing = await this.prodcutRepository.findByUrl(new ProductUrl(scrapedData.productUrl))

    if (!existing) {
      const newProduct = new Product(
        crypto.randomUUID(),
        userId,
        scrapedData.name,
        new ProductUrl(productUrl.toString()),
        scrapedData.provider as EcommerceEnum,
        scrapedData.currentPrice,
        scrapedData.initialPrice,
        scrapedData.currency,
        scrapedData.image ?? "",
        scrapedData.inStock ?? true,
        ProductMonitoringStatus.ACTIVE,
        new Date(),
        new Date()
      );
      this.prodcutRepository.create(newProduct, userId)
      return newProduct;
    }

    const priceChanged =
      existing.getCurrentPrice() !== scrapedData.currentPrice;
    const availabilityChanged = existing.getInStock() !== scrapedData.inStock;

    if (priceChanged || availabilityChanged) {
      existing.updateScrapedData(
        scrapedData.currentPrice,
        scrapedData.inStock ?? true
      );
      return this.prodcutRepository.update(existing.getId(), existing)
    }
    return existing
  }
}
