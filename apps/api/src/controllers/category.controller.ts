import type { Request, Response, NextFunction } from 'express'
import { categoryService } from '../services/category.service'

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await categoryService.getAll()
    res.json({ data: categories })
  } catch (err) {
    next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await categoryService.getById(req.params['id'] as string)
    res.json({ data: category })
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await categoryService.create(req.body)
    res.status(201).json({ data: category })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await categoryService.update(req.params['id'] as string, req.body)
    res.json({ data: category })
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await categoryService.delete(req.params['id'] as string)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id1, id2 } = req.body as { id1: string; id2: string }
    await categoryService.reorder(id1, id2)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function bulkRemove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ids } = req.body as { ids: string[] }
    await categoryService.bulkDelete(ids)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
