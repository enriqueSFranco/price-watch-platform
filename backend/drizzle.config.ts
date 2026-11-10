import { defineConfig } from "drizzle-kit";
import { envConfig } from "./src/shared/config/env";

export default defineConfig({
  schema: [
    "./src/modules/products/infraestructure/persistence/drizzle/enums.schema.ts",
    "./src/modules/products/infraestructure/persistence/drizzle/products.schema.ts",
    "./src/modules/users/infraestructure/persistence/drizzle/users.schema.ts",
    "./src/modules/scraper/infraestructure/persistence/drizzle/scrapedProducts.schema.ts",
  ],
  out: "./drizzle",
  dialect: "postgresql",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: envConfig.DATABASE_URL as string,
  },
});
