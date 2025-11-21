import { z } from 'zod';
import { ScraperSchema } from '../../scraper/domain/schemas/scraper.schema';
import { AlertSchema } from './alert.schema';

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
