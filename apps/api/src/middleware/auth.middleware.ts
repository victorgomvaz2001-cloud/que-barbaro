import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt.utils'
import type { AuthTokenPayload } from '@falcanna/types'

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden', message: 'Admin role required', statusCode: 403 })
    return
  }
  next()
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  const token =
    (req.cookies?.token as string | undefined) ??
    (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined)

  if (!token) {
    res.status(401).json({ error: 'Unauthorized', message: 'No token provided', statusCode: 401 })
    return
  }

  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token', statusCode: 401 })
  }
}
