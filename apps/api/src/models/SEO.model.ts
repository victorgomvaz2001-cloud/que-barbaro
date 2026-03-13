import { Schema, model, Document } from 'mongoose'
import type { ISEOPage } from '@falcanna/types'

export interface ISEODocument extends Omit<ISEOPage, '_id'>, Document {}

const seoSchema = new Schema<ISEODocument>(
  {
    route: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    og: {
      type: new Schema(
        { title: String, description: String, image: String, url: String, type: String },
        { _id: false },
      ),
      required: false,
    },
    twitterCard: {
      card: { type: String, enum: ['summary', 'summary_large_image', 'app', 'player'] },
      title: String,
      description: String,
      image: String,
    },
    canonical: String,
    alternates: {
      type: new Schema(
        { languages: { type: Map, of: String } },
        { _id: false },
      ),
      required: false,
    },
    robots: {
      index: Boolean,
      follow: Boolean,
      googleBot: {
        index: Boolean,
        follow: Boolean,
      },
    },
  },
  { timestamps: true },
)

export const SEO = model<ISEODocument>('SEO', seoSchema)
