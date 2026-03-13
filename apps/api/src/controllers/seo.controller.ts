import type { Request, Response, NextFunction } from 'express'
import { seoService } from '../services/seo.service'

export async function getByRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
  const route = req.query.route as string

  console.log('[SEO] Request →', {
    route,
    query: req.query,
    headers: { origin: req.headers.origin, referer: req.headers.referer },
  })

  try {
    if (!route) {
      const body = { error: 'Bad Request', message: 'route query param required', statusCode: 400 }
      console.log('[SEO] Response ← 400', body)
      res.status(400).json(body)
      return
    }
    const seo = await seoService.getByRoute(route)
    console.log('[SEO] Response ← 200', JSON.stringify(seo))
    res.json({ data: seo })
  } catch (err) {
    const statusCode = (err as { statusCode?: number }).statusCode ?? 500
    console.log('[SEO] Response ← %d', statusCode, (err as Error).message)
    next(err)
  }
}

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const seos = await seoService.getAll()
    res.json({ data: seos, total: seos.length })
  } catch (err) {
    next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const seo = await seoService.getById(req.params['id'] as string)
    res.json({ data: seo })
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const seo = await seoService.create(req.body)
    res.status(201).json({ data: seo })
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const seo = await seoService.update(req.params['id'] as string, req.body)
    res.json({ data: seo })
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await seoService.delete(req.params['id'] as string)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
