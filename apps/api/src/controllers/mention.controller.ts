import type { Request, Response, NextFunction } from 'express'
import { mentionService } from '../services/mention.service'

/* Public */
export async function getVisible(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const mentions = await mentionService.getVisible()
    res.json({ data: mentions, total: mentions.length })
  } catch (err) {
    next(err)
  }
}

/* Admin */
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const mentions = await mentionService.getAll()
    res.json({ data: mentions, total: mentions.length })
  } catch (err) {
    next(err)
  }
}

export async function getConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const config = await mentionService.getConfig()
    res.json({ data: config })
  } catch (err) {
    next(err)
  }
}

export async function updateConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const config = await mentionService.updateConfig(req.body)
    res.json({ data: config })
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const mention = await mentionService.create(req.body)
    res.status(201).json({ data: mention })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const mention = await mentionService.update(req.params['id'] as string, req.body)
    res.json({ data: mention })
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await mentionService.remove(req.params['id'] as string)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
