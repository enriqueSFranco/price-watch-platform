import { Router } from "express";
import { ScraperController } from "./scraper.controller";
import { scraperMiddleware } from "./scraper.middleware";

export const buildScraperRouter = (controller: ScraperController) => {
  const router = Router();
  router.post("/scraper/preview", scraperMiddleware, controller.run);
  return router;
};
