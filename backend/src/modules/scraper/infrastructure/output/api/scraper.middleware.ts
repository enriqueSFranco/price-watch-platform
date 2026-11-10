import { NextFunction, Request, Response } from "express";
import { ScraperRequestSchema } from "../domain/schemas/ScrapeReqSchema";
import z from "zod";

export const scraperMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body = ScraperRequestSchema.parse(req.body);
    next();
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request body",
        issues: e.issues,
      });
    }
    next(e);
  }
};
