import z from "zod";

export const ScraperRequestSchema = z.object({
  url: z.url(),
});

export type ScraperRequestType = z.infer<typeof ScraperRequestSchema>
