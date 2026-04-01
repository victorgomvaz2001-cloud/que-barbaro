import type { Request, Response, NextFunction } from 'express'
import { locationService } from '../services/location.service'
import type { LocationRegion } from '@falcanna/types'

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const region = req.query.region as LocationRegion | undefined
    const locations = await locationService.getAll(region)
    res.json({ data: locations, total: locations.length })
  } catch (err) {
    next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const location = await locationService.getById(req.params['id'] as string)
    res.json({ data: location })
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const location = await locationService.create(req.body)
    res.status(201).json({ data: location })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const location = await locationService.update(req.params['id'] as string, req.body)
    res.json({ data: location })
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await locationService.delete(req.params['id'] as string)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function bulkRemove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ids } = req.body as { ids: string[] }
    await locationService.bulkDelete(ids)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
