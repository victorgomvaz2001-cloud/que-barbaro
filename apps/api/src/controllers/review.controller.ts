import type { Request, Response, NextFunction } from 'express'
import { reviewService } from '../services/review.service'

/* Public: selected reviews for the testimonials section */
export async function getSelected(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const reviews = await reviewService.getSelected()
    res.json({ data: reviews, total: reviews.length })
  } catch (err) {
    next(err)
  }
}

/* Admin: list all reviews from DB */
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const reviews = await reviewService.getAll()
    res.json({ data: reviews, total: reviews.length })
  } catch (err) {
    next(err)
  }
}

/* Admin: sync fresh reviews from Google Places API */
export async function syncFromGoogle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const reviews = await reviewService.syncFromGoogle()
    res.json({ data: reviews, total: reviews.length })
  } catch (err) {
    next(err)
  }
}

/* Admin: update selected flag / order */
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const review = await reviewService.update(req.params['id'] as string, req.body)
    res.json({ data: review })
  } catch (err) {
    next(err)
  }
}

/* Admin: create manual review */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const review = await reviewService.create(req.body)
    res.status(201).json({ data: review })
  } catch (err) {
    next(err)
  }
}

/* Admin: delete manual review */
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await reviewService.remove(req.params['id'] as string)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id1, id2 } = req.body as { id1: string; id2: string }
    await reviewService.reorder(id1, id2)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function bulkRemove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ids } = req.body as { ids: string[] }
    await reviewService.bulkDelete(ids)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
