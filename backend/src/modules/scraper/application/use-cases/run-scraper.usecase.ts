import { ScraperErrors } from "../../domain/exeptions/ScraperErrors.ts";
import { ScraperRequestType } from "../../domain/schemas/ScrapeReqSchema.ts";
import { Result } from "../../../../shared/utils/Result.ts";
import { ScrapedProductEntity } from "../../domain/ScrapedProduct.entity.ts";
import { ScrapedProductURL } from "../../domain/value-objects/ScrapedProductURL.ts";
import { IScraperFactoryPort } from "../ports/IScraperFactoryPort.ts";

export class ScraperPreviewUseCase {
  constructor(private readonly scraperFactory: IScraperFactoryPort) {}

  public async execute(
    dto: ScraperRequestType
  ): Promise<Result<ScrapedProductEntity>> {
    try {
      const parsed = ScrapedProductURL.create(dto.url);

      if (!parsed || !parsed.getStore())
        return Result.error(ScraperErrors.UNKNOWN_SCRAPER_ERROR);

      const scraper = await this.scraperFactory.create(parsed.getStore());
      console.info(`scraper creado para la store: ${parsed}`);

      const scraped = await scraper.run(dto.url);

      if (scraped.isFailure()) {
        return Result.error(ScraperErrors.INVALID_PRODUCT_DATA);
      }

      return Result.success(scraped.Value);
    } catch (error) {
      return Result.error(ScraperErrors.UNKNOWN_SCRAPER_ERROR);
    }
  }
}
