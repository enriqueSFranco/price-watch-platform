import { uuid, numeric, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { products } from "../../../../products/infrastructure/persistence/drizzle/products.schema";

export const scrapedProducts = pgTable("scraped_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  price: numeric("price", { precision: 10, scale: 2 })
    .notNull()
    .$type<number>(),
  inStock: boolean("in_stock"),
  rawData: jsonb("raw_data"), // guardar el HTML o datos crudos del scraper
  scrapedAt: timestamp("scraped_at", { withTimezone: true }).defaultNow(),
});
