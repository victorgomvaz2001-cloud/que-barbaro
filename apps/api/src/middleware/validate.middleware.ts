import type { Request, Response, NextFunction } from 'express'
import { type ZodSchema, ZodError } from 'zod'

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(422).json({
          error: 'Validation Error',
          message: 'Invalid request data',
          statusCode: 422,
          details: error.flatten().fieldErrors,
        })
        return
      }
      next(error)
    }
  }
}
