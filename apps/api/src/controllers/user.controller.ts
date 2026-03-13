import type { Request, Response, NextFunction } from 'express'
import { userService } from '../services/user.service'

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.create(req.body)
    res.status(201).json({ data: user })
  } catch (err) {
    next(err)
  }
}

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await userService.getAll()
    res.json({ data: users, total: users.length })
  } catch (err) {
    next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.getById(req.params['id'] as string)
    res.json({ data: user })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.update(req.params['id'] as string, req.body)
    res.json({ data: user })
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await userService.delete(req.params['id'] as string)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
