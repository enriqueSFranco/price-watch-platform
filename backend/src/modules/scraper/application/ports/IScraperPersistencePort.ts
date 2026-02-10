import { ScrapedProductEntity } from "../../domain/ScrapedProduct.entity";

// metodos que usa el scraper para la persitencia de datos
export interface IScraperPersistencePort {
  save(scrapedProduct: ScrapedProductEntity): Promise<ScrapedProductEntity>;
}
