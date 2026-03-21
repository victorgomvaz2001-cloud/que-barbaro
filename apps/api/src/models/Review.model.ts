import { Schema, model, Document } from 'mongoose'
import type { IReview } from '@falcanna/types'

export interface IReviewDocument extends Omit<IReview, '_id'>, Document {}

const reviewSchema = new Schema<IReviewDocument>(
  {
    googleId:       { type: String, required: true, unique: true },
    source:         { type: String, enum: ['google', 'manual'], default: 'google' },
    authorName:     { type: String, required: true },
    authorPhotoUrl: { type: String, default: '' },
    rating:         { type: Number, required: true },
    text:           { type: String, required: true },
    relativeTime:   { type: String, default: '' },
    publishTime:    { type: String, default: '' },
    selected:       { type: Boolean, default: false },
    order:          { type: Number, default: 0 },
  },
  { timestamps: true },
)

reviewSchema.index({ selected: 1, order: 1 })

export const Review = model<IReviewDocument>('Review', reviewSchema)
