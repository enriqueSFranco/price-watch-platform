import { z } from "zod";

export const AlertTypeEnum = z.enum([
  "PRICE_DROP",
  "OUT_OF_STOCK",
  "IN_STOCK",
  "PRICE_RISE",
]);

export const AlertSchema = z.object({
  id: z.uuidv4(),
  productId: z.string().uuid(),
  type: AlertTypeEnum,
  message: z.string(),
  triggeredAt: z.date().default(new Date()),
  seen: z.boolean().default(false),
});

export type Alert = z.infer<typeof AlertSchema>;
