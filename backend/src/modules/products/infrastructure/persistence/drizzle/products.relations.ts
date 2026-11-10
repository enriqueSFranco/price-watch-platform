import { relations } from "drizzle-orm";
import { products } from "./products.schema";
import { users } from "../../../../users/infrastructure/persistence/drizzle/users.schema";
import { scrapedProducts } from "../../../../scraper/infrastructure/persistence/drizzle/scrapedProducts.schema";
import { alertRules } from "../../../../alerts/infrastructure/persistence/alerts.schema";

export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
  priceHistory: many(scrapedProducts),
  alertRules: many(alertRules),
}));
