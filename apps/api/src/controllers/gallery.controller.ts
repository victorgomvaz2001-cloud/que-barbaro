import type { Request, Response, NextFunction } from 'express'
import { galleryService } from '../services/gallery.service'

export async function getPage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page  = Math.max(1, parseInt(String(req.query['page']  ?? '1'),  10))
    const limit = Math.max(1, Math.min(50, parseInt(String(req.query['limit'] ?? '16'), 10)))
    const result = await galleryService.getPage(page, limit)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const photos = await galleryService.getAll()
    res.json({ data: photos, total: photos.length })
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const photo = await galleryService.create(req.body)
    res.status(201).json({ data: photo })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const photo = await galleryService.update(req.params['id'] as string, req.body)
    res.json({ data: photo })
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await galleryService.delete(req.params['id'] as string)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
