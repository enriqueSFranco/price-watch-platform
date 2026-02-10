import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const envSchema = z.object({
  API_BASE_URL: z.url(),
  PORT: z.string().default("4000").transform(Number),
  DATABASE_URL: z.string(),
  REPOSITORY_TYPE: z.enum([
    "local",
    "drizzle",
    "postgresql",
  ]),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error.flatten());
  throw new Error('Invalid environment variables');
}

export const envConfig = {
  BASE_URL: parsed.data.API_BASE_URL,
  PORT: parsed.data.PORT,
  DATABASE_URL: parsed.data.DATABASE_URL,
  REPOSITORY_TYPE: parsed.data.REPOSITORY_TYPE,
};
