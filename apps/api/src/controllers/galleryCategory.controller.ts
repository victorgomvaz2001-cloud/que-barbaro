import type { Request, Response, NextFunction } from 'express'
import { galleryCategoryService } from '../services/galleryCategory.service'

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await galleryCategoryService.getAll()
    res.json({ data: categories, total: categories.length })
  } catch (err) {
    next(err)
  }
}

export async function getAllAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await galleryCategoryService.getAllAdmin()
    res.json({ data: categories, total: categories.length })
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await galleryCategoryService.create(req.body)
    res.status(201).json({ data: category })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await galleryCategoryService.update(req.params['id'] as string, req.body)
    res.json({ data: category })
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await galleryCategoryService.delete(req.params['id'] as string)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id1, id2 } = req.body as { id1: string; id2: string }
    await galleryCategoryService.reorder(id1, id2)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function bulkRemove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ids } = req.body as { ids: string[] }
    await galleryCategoryService.bulkDelete(ids)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
