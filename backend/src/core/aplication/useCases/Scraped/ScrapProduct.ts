import { ProductMonitoringStatus } from "../../../../db/schema";
import { ILoggerAdapter } from "../../../../infraestructure/adapters/logging/config";
import { EcommerceEnum } from "../../../../infraestructure/scrapers/enums";
import { ScraperFactory } from "../../../../infraestructure/scrapers/ScraperFactory";
import { Product } from "../../../domain/products/Product";
import { ProductUrl } from "../../../domain/products/ProductUrl";
import { IProductRepository } from "../../../ports/repositories/IProductRepository";
import { IScraper } from "../../../ports/scrapers/IScraper";

export class ScrapProduct {
  constructor(
    private readonly scraperFactory: ScraperFactory,
    private readonly productRepository: IProductRepository,
    private readonly logger: ILoggerAdapter
  ) {}

  public async execute(productUrl: string, userId: string): Promise<Product> {
    this.logger.info(
      `✅ [USE CASE] Iniciando proceso de scraping para: ${productUrl.toString()}`
    );

    try {
      const site = ProductUrl.getSiteFromUrl(productUrl) as EcommerceEnum;
      const scraper = this.scraperFactory.createScraper(site);
      this.logger.info("🎉 [USE CASE] Datos extraídos con éxito.");
      const rawProductData = await scraper.run(new ProductUrl(productUrl))
      const productId = `${crypto
        .randomUUID()
        .slice(4)}${ProductUrl.getSiteFromUrl(rawProductData.productUrl)}`;
        const provider = ProductUrl.getSiteFromUrl(productUrl)
        const imageSrc = rawProductData.image ?? "";
        const inStock = rawProductData.inStock ?? true;
      const newProductInstance = new Product(
        productId,
        userId,
        rawProductData.name,
        new ProductUrl(rawProductData.productUrl),
        provider,
        rawProductData.currentPrice,
        rawProductData.initialPrice,
        rawProductData.currency,
        imageSrc,
        inStock,
        ProductMonitoringStatus.ACTIVE,
        rawProductData.lastScrapedAt,
        rawProductData.createdAt
      );

      const savedProduct = this.productRepository.create(
        newProductInstance,
        userId
      );
      return savedProduct;
    } catch (error) {
      this.logger.error(
        `❌ [USE CASE] Fallo al procesar la URL: ${productUrl.toString()}. Error: ${
          error.message
        }`
      );
      throw error; // Propaga el error para que sea manejado por el controlador/handler de la API
    }
  }
}
