import { uuid, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { pgTable, pgEnum } from "drizzle-orm/pg-core";
import { products } from "../../../products/infrastructure/persistence/drizzle/products.schema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { users } from "../../../../shared/config/db-schema";

export const alertTypeEnum = pgEnum("alert_type", ["price_below", "available"]);

export const alertRules = pgTable("alert_rules", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  type: alertTypeEnum().notNull(),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  webhookUrl: timestamp("webhook_url", { withTimezone: true }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const alertRulesRelations = relations(alertRules, ({ one }) => ({
  user: one(users, {
    fields: [alertRules.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [alertRules.productId],
    references: [products.id],
  }),
}));

export type AlertRuleSelect = InferSelectModel<typeof alertRules>;
export type AlertRuleInsert = InferInsertModel<typeof alertRules>;
