import { Category } from '../models/Category.model'
import type { IBlogCategoryCreate, IBlogCategoryUpdate } from '@falcanna/types'

export class CategoryService {
  async getAll() {
    return Category.find().sort({ order: 1, createdAt: 1 }).lean()
  }

  async getById(id: string) {
    const category = await Category.findById(id).lean()
    if (!category) throw Object.assign(new Error('Category not found'), { statusCode: 404 })
    return category
  }

  async create(data: IBlogCategoryCreate) {
    return Category.create(data)
  }

  async update(id: string, data: IBlogCategoryUpdate) {
    const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean()
    if (!category) throw Object.assign(new Error('Category not found'), { statusCode: 404 })
    return category
  }

  async delete(id: string) {
    const category = await Category.findByIdAndDelete(id)
    if (!category) throw Object.assign(new Error('Category not found'), { statusCode: 404 })
  }
}

export const categoryService = new CategoryService()
