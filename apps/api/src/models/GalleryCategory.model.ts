import { Schema, model, Document } from 'mongoose'
import type { IGalleryCategory } from '@falcanna/types'

export interface IGalleryCategoryDocument extends Omit<IGalleryCategory, '_id'>, Document {}

const galleryCategorySchema = new Schema<IGalleryCategoryDocument>(
  {
    slug:          { type: String, required: true, unique: true, trim: true },
    nameEs:        { type: String, required: true },
    nameEn:        { type: String, required: true },
    descriptionEs: { type: String, default: '' },
    descriptionEn: { type: String, default: '' },
    order:         { type: Number, default: 0 },
    active:        { type: Boolean, default: true },
  },
  { timestamps: true },
)

galleryCategorySchema.index({ active: 1, order: 1 })

export const GalleryCategory = model<IGalleryCategoryDocument>('GalleryCategory', galleryCategorySchema)
