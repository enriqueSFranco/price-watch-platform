import { z } from 'zod';

export const SearchSchema = z.object({
  q: z
    .string()
    .min(1, "El término de búsqueda no puede estar vacío.")
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      "El término de búsqueda solo puede contener letras y números."
    ),
  page: z
    .string()
    .optional()
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .default(1),
  per_page: z
    .string()
    .optional()
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .default(1),
  sortBy: z
    .enum(["name",  "currentPrice", "lastScrapedAt"])
    .default("name")
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
});

export type SearchProductType = z.infer<typeof SearchProductSchema>
