import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { envConfig } from "./env.ts";
import * as schema from "./db-schema.ts"

export const pool = new Pool({
  connectionString: envConfig.DATABASE_URL,
});
export const db = drizzle(pool, { schema });

export async function connectDb() {
  try {
    await pool.connect();
    console.log("✅ Conectado a PostgreSQL con éxito.");
  } catch (error) {
    console.error("❌ Error al conectar a PostgreSQL:", error);
    process.exit(1);
  }
}

export async function disconnectDb() {
  try {
    await pool.end();
    console.log("👋 Desconectado de PostgreSQL.");
  } catch (error) {
    console.error("❌ Error al desconectar de PostgreSQL:", error);
  }
}
