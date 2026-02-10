import { Store } from "../../domain/store.enums";
import { BaseProductScraper } from "../../infrastructure/input/scrapers/BaseProductScraper";

export interface IScraperFactoryPort {
  create(store: Store): Promise<BaseProductScraper>;
}
