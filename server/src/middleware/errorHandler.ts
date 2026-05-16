import { Request, Response, NextFunction } from 'express'

interface AppError extends Error {
  statusCode?: number
}

/**
 * Global error handler middleware.
 * Catches unhandled errors and returns a consistent JSON response.
 */
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  console.error(`[ERROR] ${statusCode}: ${message}`)
  if (statusCode === 500) {
    console.error(err.stack)
  }

  res.status(statusCode).json({
    error: message,
    statusCode,
  })
}
