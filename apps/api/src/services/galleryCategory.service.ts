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
    await GalleryCategory.updateMany({}, { $inc: { order: 1 } })
    return GalleryCategory.create({ ...data, order: 0 })
  }

  async reorder(id1: string, id2: string) {
    const [item1, item2] = await Promise.all([GalleryCategory.findById(id1), GalleryCategory.findById(id2)])
    if (!item1 || !item2) throw Object.assign(new Error('Gallery category not found'), { statusCode: 404 })
    await Promise.all([
      GalleryCategory.findByIdAndUpdate(id1, { order: item2.order }),
      GalleryCategory.findByIdAndUpdate(id2, { order: item1.order }),
    ])
  }

  async bulkDelete(ids: string[]) {
    await GalleryCategory.deleteMany({ _id: { $in: ids } })
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
