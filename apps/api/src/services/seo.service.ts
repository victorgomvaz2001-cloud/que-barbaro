import { SEO } from '../models/SEO.model'
import type { ISEOPageCreate, ISEOPageUpdate } from '@falcanna/types'

export class SEOService {
  async getByRoute(route: string) {
    const seo = await SEO.findOne({ route }).lean()
    if (!seo) {
      throw Object.assign(new Error(`SEO not found for route: ${route}`), { statusCode: 404 })
    }
    return seo
  }

  async getAll() {
    return SEO.find().lean()
  }

  async getById(id: string) {
    const seo = await SEO.findById(id).lean()
    if (!seo) throw Object.assign(new Error('SEO not found'), { statusCode: 404 })
    return seo
  }

  async create(data: ISEOPageCreate) {
    return SEO.create(data)
  }

  async update(id: string, data: ISEOPageUpdate) {
    const seo = await SEO.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean()
    if (!seo) throw Object.assign(new Error('SEO not found'), { statusCode: 404 })
    return seo
  }

  async delete(id: string) {
    const seo = await SEO.findByIdAndDelete(id)
    if (!seo) throw Object.assign(new Error('SEO not found'), { statusCode: 404 })
  }
}

export const seoService = new SEOService()
