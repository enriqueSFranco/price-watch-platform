import {z} from "zod"

export const ProductSchema = z.object({
  id: z.uuid(),
  name: z.string().nonempty(),
  currentPrice: z.number().nonnegative(),
  imageUrl: z.string(),
  productUrl: z.string(),
  lastScrapedAt: z.date()
})

export type ProductType = z.infer<typeof ProductSchema>

export const ApiResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  original_url: z.url(),
  domain: z.url(),
  image_url: z.url(),
  current_price: z.number(),
  currency: z.string(),
  last_checked_at: z.string(),
  initial_price: z.number(),
  price_change_absolute: z.number(),
  price_change_percentage: z.number(),
  lowest_recorded_price: z.number(),
  notification_rules: z.array(z.object({
    type: z.string(),
    value: z.number(),
    alert_sent: z.boolean(),
  })),
  status: z.string(),
})

export type ApiResponseType = z.infer<typeof ApiResponseSchema>
