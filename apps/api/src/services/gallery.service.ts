import { Gallery } from '../models/Gallery.model'
import type { GallerySection, IGalleryPhotoCreate, IGalleryPhotoUpdate } from '@falcanna/types'

const DEFAULT_LIMIT = 16

export class GalleryService {
  async getPage(page: number, limit = DEFAULT_LIMIT, section?: GallerySection) {
    const skip = (page - 1) * limit
    const filter: Record<string, unknown> = { visible: true }
    if (section) filter['section'] = section

    const [data, total] = await Promise.all([
      Gallery.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Gallery.countDocuments(filter),
    ])
    return { data, total, page, hasMore: skip + data.length < total }
  }

  async getBySection(section: GallerySection) {
    return Gallery.find({ visible: true, section })
      .sort({ order: 1, createdAt: -1 })
      .lean()
  }

  async getAll(section?: GallerySection) {
    const filter = section ? { section } : {}
    return Gallery.find(filter).sort({ order: 1, createdAt: -1 }).lean()
  }

  async getById(id: string) {
    const photo = await Gallery.findById(id).lean()
    if (!photo) throw Object.assign(new Error('Gallery photo not found'), { statusCode: 404 })
    return photo
  }

  async create(data: IGalleryPhotoCreate) {
    return Gallery.create(data)
  }

  async update(id: string, data: IGalleryPhotoUpdate) {
    const photo = await Gallery.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean()
    if (!photo) throw Object.assign(new Error('Gallery photo not found'), { statusCode: 404 })
    return photo
  }

  async delete(id: string) {
    const photo = await Gallery.findByIdAndDelete(id)
    if (!photo) throw Object.assign(new Error('Gallery photo not found'), { statusCode: 404 })
  }
}

export const galleryService = new GalleryService()
