import type { Request, Response, NextFunction } from 'express'
import { promotionService } from '../services/promotion.service'

/* Public */
export async function getActive(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const promotion = await promotionService.getActive()
    res.json({ data: promotion ?? null })
  } catch (err) {
    next(err)
  }
}

/* Admin */
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const promotions = await promotionService.getAll()
    res.json({ data: promotions, total: promotions.length })
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const promotion = await promotionService.create(req.body)
    res.status(201).json({ data: promotion })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const promotion = await promotionService.update(req.params['id'] as string, req.body)
    res.json({ data: promotion })
  } catch (err) {
    next(err)
  }
}

export async function activate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const promotion = await promotionService.activate(req.params['id'] as string)
    res.json({ data: promotion })
  } catch (err) {
    next(err)
  }
}

export async function deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const promotion = await promotionService.deactivate(req.params['id'] as string)
    res.json({ data: promotion })
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await promotionService.remove(req.params['id'] as string)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
