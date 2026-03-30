import { GalleryCategory } from '../models/GalleryCategory.model'
import type { IGalleryCategoryCreate, IGalleryCategoryUpdate } from '@falcanna/types'

export class GalleryCategoryService {
  async getAll() {
    return GalleryCategory.find({ active: true }).sort({ order: 1 }).lean()
  }

  async getAllAdmin() {
    return GalleryCategory.find().sort({ order: 1 }).lean()
  }

  async getById(id: string) {
    const cat = await GalleryCategory.findById(id).lean()
    if (!cat) throw Object.assign(new Error('Gallery category not found'), { statusCode: 404 })
    return cat
  }

  async create(data: IGalleryCategoryCreate) {
    return GalleryCategory.create(data)
  }

  async update(id: string, data: IGalleryCategoryUpdate) {
    const cat = await GalleryCategory.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean()
    if (!cat) throw Object.assign(new Error('Gallery category not found'), { statusCode: 404 })
    return cat
  }

  async delete(id: string) {
    const cat = await GalleryCategory.findByIdAndDelete(id)
    if (!cat) throw Object.assign(new Error('Gallery category not found'), { statusCode: 404 })
  }
}

export const galleryCategoryService = new GalleryCategoryService()
