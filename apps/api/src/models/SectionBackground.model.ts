import { Schema, model, Document } from 'mongoose'
import type { ISectionBackground } from '@falcanna/types'

export interface ISectionBackgroundDocument
  extends Omit<ISectionBackground, '_id'>,
    Document {}

const sectionBackgroundSchema = new Schema<ISectionBackgroundDocument>(
  {
    pageSlug:   { type: String, required: true },
    sectionKey: { type: String, required: true },
    imageUrl:   { type: String, default: null },
  },
  { timestamps: true },
)

sectionBackgroundSchema.index({ pageSlug: 1, sectionKey: 1 }, { unique: true })

export const SectionBackground = model<ISectionBackgroundDocument>(
  'SectionBackground',
  sectionBackgroundSchema,
)
