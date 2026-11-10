import {
  numeric,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { users } from "../../../../users/infrastructure/persistence/drizzle/users.schema";
import { StoreEnum, productMonitoringStatusEnum } from "./enums.schema";

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 125 }).notNull(),
    initialPrice: numeric("initial_price", {
      precision: 10,
      scale: 2,
    })
      .notNull()
      .$type<number>(),
    currentPrice: numeric("current_price", {
      precision: 10,
      scale: 2,
    })
      .notNull()
      .$type<number>(),
    provider: StoreEnum(),
    imageUrl: text("image_url"),
    url: varchar("url", { length: 255 }).notNull(),
    monitoringStatus: productMonitoringStatusEnum(),
    inStock: boolean("in_stock").notNull().default(true),
    lastScrapedAt: timestamp("last_scraped_at", {
      withTimezone: true,
    }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("user_url_idx").on(table.userId, table.url)]
);

export type ProductRow = typeof products.$inferSelect;
