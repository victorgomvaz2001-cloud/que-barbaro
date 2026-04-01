import { Schema, model, Document } from 'mongoose'
import type { IBlogCategory } from '@falcanna/types'

export interface ICategoryDocument extends Omit<IBlogCategory, '_id'>, Document {}

const categorySchema = new Schema<ICategoryDocument>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    nameEs: { type: String, required: true },
    nameEn: { type: String, required: true },
    descriptionEs: { type: String, default: '' },
    descriptionEn: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

categorySchema.index({ order: 1 })

export const Category = model<ICategoryDocument>('Category', categorySchema)
