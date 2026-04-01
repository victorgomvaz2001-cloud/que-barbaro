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
    filters: {
      q?: string
      author?: string
      category?: string
      date?: string
      featured?: boolean
      locale?: string
      sort?: string
    } = {},
  ) {
    const query: Record<string, unknown> = { draft: false }
    if (filters.q) {
      query['$or'] = [
        { title:  { $regex: filters.q, $options: 'i' } },
        { slug:   { $regex: filters.q, $options: 'i' } },
        { author: { $regex: filters.q, $options: 'i' } },
      ]
    }
    if (filters.category) query['category'] = filters.category
    if (filters.date)     query['publishedAt'] = { $regex: `^${filters.date}` }
    if (filters.featured) query['featured'] = true
    if (filters.locale)   query['locale']   = filters.locale

    let sortOption: Record<string, 1 | -1> = { publishedAt: -1 }
    if (filters.sort === 'date-asc')   sortOption = { publishedAt: 1 }
    if (filters.sort === 'alpha-asc')  sortOption = { title: 1 }
    if (filters.sort === 'alpha-desc') sortOption = { title: -1 }

    const [data, total] = await Promise.all([
      Blog.find(query).sort(sortOption).skip(offset).limit(limit).lean(),
      Blog.countDocuments(query),
    ])
    return { data, total, hasMore: offset + data.length < total }
  }

  async getCategories(locale?: string) {
    const filter: Record<string, unknown> = { draft: false, category: { $exists: true, $nin: [null, ''] } }
    if (locale) filter['locale'] = locale
    return Blog.distinct('category', filter)
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

  async bulkDelete(ids: string[]) {
    await Blog.deleteMany({ _id: { $in: ids } })
  }
}

export const blogService = new BlogService()
