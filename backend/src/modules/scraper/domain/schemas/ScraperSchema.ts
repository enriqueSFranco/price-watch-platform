import z from "zod";
import { PriceSchema } from "./PriceSchema";

export const ScraperSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  initialPrice: PriceSchema,
  currentPrice: PriceSchema,
  imageUrl: z.url().nullable(),
  inStock: z.boolean().default(true),
  lastScrapedAt: z.date().default(new Date()),
});

export type ScraperData = z.infer<typeof ScraperSchema>;
