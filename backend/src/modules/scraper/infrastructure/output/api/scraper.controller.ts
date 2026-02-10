import type { Response, Request } from "express";
import { ScraperPreviewUseCase } from "../application/use-cases/ScraperPreviewUseCase.ts";
import { ScrapedProductURL } from "../domain/value-objects/ScrapedProductURL.ts";

export class ScraperController {
  constructor(private readonly useCase: ScraperPreviewUseCase) {}

  public run = async (req: Request, res: Response) => {
    try {
      const { url } = req.body;

      const productUrl = ScrapedProductURL.create(url);
      const Store = productUrl.getStore();

      if (!Store) {
        return res.status(400).json({ Store, message: "Invalid Store URL" });
      }

      if (!url) {
        return res
          .status(400)
          .json({ message: "URL and userId are required." });
      }

      const previewProduct = await this.useCase.execute(url);

      if (!previewProduct) {
        return res.status(404).json({ message: "Product data not found." });
      }

      return res.status(200).json({
        status: "success",
        previewProduct,
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unexpected error during scraping",
      });
    }
  };
}
