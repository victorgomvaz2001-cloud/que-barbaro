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
