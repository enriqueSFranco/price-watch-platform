import type { NextFunction, Request, Response } from "express";
import { ZodError } from 'zod';
import { ApiError } from "../../../../core/errors/api.error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("⚠️ [Error Handler] Error detectado:", err);
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Error de validación de datos',
        details: err.issues.map(issue => ({
          path: issue.path,
          message: issue.message
        }))
      }
    })
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.errorCode,
        message: err.message
      }
    })
  }

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ha ocurrido un erro inesperado',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined // Only show details in dev
    }
  });
}
