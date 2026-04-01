import type { Request, Response, NextFunction } from 'express'
import { sectionBackgroundService } from '../services/sectionBackground.service'

/** GET /section-backgrounds/:pageSlug  (public) */
export async function getByPage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await sectionBackgroundService.getByPage(req.params['pageSlug'] as string)
    res.json({ data })
  } catch (err) {
    next(err)
  }
}

/** PUT /admin/section-backgrounds/:pageSlug/:sectionKey */
export async function upsert(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { pageSlug, sectionKey } = req.params as { pageSlug: string; sectionKey: string }
    const { imageUrl } = req.body as { imageUrl: string | null }
    const data = await sectionBackgroundService.upsert(pageSlug, sectionKey, imageUrl ?? null)
    res.json({ data })
  } catch (err) {
    next(err)
  }
}

/** DELETE /admin/section-backgrounds/:pageSlug/:sectionKey */
export async function remove(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { pageSlug, sectionKey } = req.params as { pageSlug: string; sectionKey: string }
    await sectionBackgroundService.remove(pageSlug, sectionKey)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
