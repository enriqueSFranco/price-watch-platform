import {Router} from "express"
import { ScraperController } from "./scraper.controller"
import { validateScraperRequest } from "./validateScraperRequest.middleware";

export const buildScraperRouter = (controller: ScraperController) => {
  const router = Router();
  router.post("/scraper", validateScraperRequest, controller.run);
  return router;
};
