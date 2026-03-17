import { Schema, model, Document } from 'mongoose'
import type { IGalleryPhoto } from '@falcanna/types'

export interface IGalleryDocument extends Omit<IGalleryPhoto, '_id'>, Document {}

const gallerySchema = new Schema<IGalleryDocument>(
  {
    url:      { type: String, required: true },
    alt:      { type: String, default: '' },
    category: { type: String, default: '' },
    order:    { type: Number, default: 0 },
    visible:  { type: Boolean, default: true },
  },
  { timestamps: true },
)

gallerySchema.index({ visible: 1, order: 1, createdAt: -1 })

export const Gallery = model<IGalleryDocument>('Gallery', gallerySchema)
