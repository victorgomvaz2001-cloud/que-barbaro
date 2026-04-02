import type { Request, Response, NextFunction } from 'express'
import { blogService } from '../services/blog.service'

export async function getPage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const offset = Math.max(parseInt(req.query['offset'] as string) || 0, 0)
    const limit = Math.min(parseInt(req.query['limit'] as string) || 9, 50)
    const filters = {
      q:        req.query['q']        as string | undefined,
      category: req.query['category'] as string | undefined,
      date:     req.query['date']     as string | undefined,
      featured: req.query['featured'] === 'true' ? true : undefined,
      locale:   req.query['locale']   as string | undefined,
      sort:     req.query['sort']     as string | undefined,
    }
    const result = await blogService.getPage(offset, limit, filters)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const locale = req.query['locale'] as string | undefined
    const categories = await blogService.getCategories(locale)
    res.json({ data: categories })
  } catch (err) {
    next(err)
  }
}

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

export async function bulkRemove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ids } = req.body as { ids: string[] }
    await blogService.bulkDelete(ids)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function bulkAssignCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ids, category } = req.body as { ids: string[]; category: string }
    await blogService.bulkAssignCategory(ids, category)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
