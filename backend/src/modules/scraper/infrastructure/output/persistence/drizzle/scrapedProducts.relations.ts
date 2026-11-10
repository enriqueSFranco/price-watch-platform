import { relations } from "drizzle-orm";
import { scrapedProducts } from "./scrapedProducts.schema";
import { products } from "../../../../products/infrastructure/persistence/drizzle/products.schema";

export const scrapedProductsRelations = relations(
  scrapedProducts,
  ({ one }) => ({
    product: one(products, {
      fields: [scrapedProducts.productId],
      references: [products.id],
    }),
  })
);
