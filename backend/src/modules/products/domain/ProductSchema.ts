import { z } from "zod";
import { ScraperSchema } from "../../scraper/domain/schemas/ScraperSchema";
import { AlertSchema } from "../../alerts/domain/AlertSchema";

export const ProductSchema = z.object({
  id: z.uuid(),
  scrapedProductData: ScraperSchema,
  alerts: z.array(AlertSchema).default([]),
  createdAt: z.date().default(new Date()),
});

export const ProductUpdateSchema = ProductSchema.partial();

export const ProductCreateSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  lastScrapedAt: true,
});
