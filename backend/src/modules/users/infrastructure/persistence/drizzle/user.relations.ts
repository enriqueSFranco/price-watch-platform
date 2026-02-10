import { relations } from "drizzle-orm";
import { products } from "../../../../products/infrastructure/persistence/drizzle/products.schema";
import { alertRules } from "../../../../alerts/infrastructure/persistence/alerts.schema";
import { users } from "./users.schema";

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  alertRules: many(alertRules),
}));
