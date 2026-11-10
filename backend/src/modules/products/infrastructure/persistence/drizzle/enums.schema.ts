import { pgEnum } from "drizzle-orm/pg-core";

export const StoreEnum = pgEnum("Store", ["Amazon", "Liverpool"]);

export const productMonitoringStatusEnum = pgEnum("product_monitoring_status", [
  "Active",
  "Paused",
  "Error",
]);
