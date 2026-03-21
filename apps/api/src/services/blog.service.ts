import { Blog } from '../models/Blog.model'
import type { IBlogPostCreate, IBlogPostUpdate } from '@falcanna/types'

export class BlogService {
  async getAll(includesDrafts = false) {
    const filter = includesDrafts ? {} : { draft: false }
    return Blog.find(filter).sort({ publishedAt: -1 }).lean()
  }

  async getPage(
    offset: number,
    limit: number,
    filters: { q?: string; author?: string; category?: string; date?: string; featured?: boolean } = {},
  ) {
    const query: Record<string, unknown> = { draft: false }
    if (filters.q)        query['title']    = { $regex: filters.q, $options: 'i' }
    if (filters.author)   query['author']   = { $regex: filters.author, $options: 'i' }
    if (filters.category) query['category'] = filters.category
    if (filters.date)     query['publishedAt'] = { $regex: `^${filters.date}` }
    if (filters.featured) query['featured'] = true

    const [data, total] = await Promise.all([
      Blog.find(query).sort({ publishedAt: -1 }).skip(offset).limit(limit).lean(),
      Blog.countDocuments(query),
    ])
    return { data, total, hasMore: offset + data.length < total }
  }

  async getCategories() {
    return Blog.distinct('category', { draft: false, category: { $exists: true, $nin: [null, ''] } })
  }

  async getBySlug(slug: string, includeDraft = false) {
    const filter = includeDraft ? { slug } : { slug, draft: false }
    const post = await Blog.findOne(filter).lean()
    if (!post) throw Object.assign(new Error('Blog post not found'), { statusCode: 404 })
    return post
  }

  async getById(id: string) {
    const post = await Blog.findById(id).lean()
    if (!post) throw Object.assign(new Error('Blog post not found'), { statusCode: 404 })
    return post
  }

  async create(data: IBlogPostCreate) {
    return Blog.create(data)
  }

  async update(id: string, data: IBlogPostUpdate) {
    const post = await Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean()
    if (!post) throw Object.assign(new Error('Blog post not found'), { statusCode: 404 })
    return post
  }

  async delete(id: string) {
    const post = await Blog.findByIdAndDelete(id)
    if (!post) throw Object.assign(new Error('Blog post not found'), { statusCode: 404 })
  }
}

export const blogService = new BlogService()
