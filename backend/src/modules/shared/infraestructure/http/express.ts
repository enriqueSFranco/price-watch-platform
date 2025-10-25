import express from "express"
import bodyParser from "body-parser"
import { buildScraperRouter } from "../../../scraper/rest/scraper.routes";
import { ScraperController } from "../../../scraper/rest/scraper.controller";
import { ScrapeProductUseCase } from "../../../scraper/application/use-cases/ScrapeProduct.usecase";


export function createApp() {
  const app = express()
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json());

  const scrapeProductUseCase = new ScrapeProductUseCase();
  const scraperController = new ScraperController(scrapeProductUseCase);

  app.use("/api", buildScraperRouter(scraperController));

  return app
}
