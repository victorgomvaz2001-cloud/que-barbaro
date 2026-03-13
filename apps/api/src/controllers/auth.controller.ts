import type { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string }
    const { token, user } = await authService.login(email, password)
    res.cookie('token', token, COOKIE_OPTIONS)
    res.json({ data: { user } })
  } catch (err) {
    next(err)
  }
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, user } = await authService.register(req.body)
    res.cookie('token', token, COOKIE_OPTIONS)
    res.status(201).json({ data: { user } })
  } catch (err) {
    next(err)
  }
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie('token')
  res.json({ data: null, message: 'Logged out successfully' })
}

export function me(req: Request, res: Response): void {
  res.json({ data: req.user })
}
