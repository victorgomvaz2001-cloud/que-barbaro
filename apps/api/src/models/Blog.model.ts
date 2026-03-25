import { Schema, model, Document } from 'mongoose'
import type { IBlogPost } from '@falcanna/types'

export interface IBlogDocument extends Omit<IBlogPost, '_id'>, Document {}

const blogSchema = new Schema<IBlogDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, default: '' },
    excerpt: String,
    image: String,
    author: { type: String, required: true },
    authorImage: String,
    featured: { type: Boolean, default: false },
    category: { type: String, required: true },
    locale: { type: String, default: 'es' },
    publishedAt: { type: String, required: true },
    draft: { type: Boolean, default: true },
  },
  { timestamps: true },
)

blogSchema.index({ draft: 1, publishedAt: -1 })

export const Blog = model<IBlogDocument>('Blog', blogSchema)
