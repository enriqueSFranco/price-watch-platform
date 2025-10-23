import z from "zod";
import { PriceSchema } from "./price.schema";
import { Ecommerce } from "../../infraestructure/ecommerce.enums";
import { ProductMonitoringStatus } from "../../../products/infraestructure/product-monitoring.enum";

export const ScraperSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productUrl: z.url("Invalid product URL"),
  ecommerce: z.enum([Ecommerce.Liverpool, Ecommerce.Amazon]),
  productInitialPrice: PriceSchema,
  productCurrentPrice: PriceSchema,
  imageUrl: z.url().nullable(),
  inStock: z.boolean().default(true),
  monitoring: z.enum([
    ProductMonitoringStatus.Active,
    ProductMonitoringStatus.Paused,
    ProductMonitoringStatus.Error,
  ]),
  lastScrapedAt: z.date().default(new Date()),
});

export type ScraperData = z.infer<typeof ScraperSchema>;
