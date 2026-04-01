import type { Request, Response, NextFunction } from 'express'
import { galleryService } from '../services/gallery.service'
import type { GallerySection } from '@falcanna/types'

export async function getPage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page    = Math.max(1, parseInt(String(req.query['page']  ?? '1'),  10))
    const limit   = Math.max(1, Math.min(50, parseInt(String(req.query['limit'] ?? '16'), 10)))
    const section = req.query['section'] as GallerySection | undefined
    const result  = await galleryService.getPage(page, limit, section)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function getBySection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const section = req.params['section'] as GallerySection
    const photos  = await galleryService.getBySection(section)
    res.json({ data: photos, total: photos.length })
  } catch (err) {
    next(err)
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const section = req.query['section'] as GallerySection | undefined
    const photos  = await galleryService.getAll(section)
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

export async function reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id1, id2 } = req.body as { id1: string; id2: string }
    await galleryService.reorder(id1, id2)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function bulkRemove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ids } = req.body as { ids: string[] }
    await galleryService.bulkDelete(ids)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
