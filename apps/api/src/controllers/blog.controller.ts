import type { Request, Response, NextFunction } from 'express'
import { blogService } from '../services/blog.service'

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const isAdmin = !!req.user
    const posts = await blogService.getAll(isAdmin)
    res.json({ data: posts, total: posts.length })
  } catch (err) {
    next(err)
  }
}

export async function getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const isAdmin = !!req.user
    const post = await blogService.getBySlug(req.params['slug'] as string, isAdmin)
    res.json({ data: post })
  } catch (err) {
    next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await blogService.getById(req.params['id'] as string)
    res.json({ data: post })
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await blogService.create(req.body)
    res.status(201).json({ data: post })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await blogService.update(req.params['id'] as string, req.body)
    res.json({ data: post })
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await blogService.delete(req.params['id'] as string)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
