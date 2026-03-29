import { Schema, model, Document } from 'mongoose'
import type { IPromotion } from '@falcanna/types'

export interface IPromotionDocument extends Omit<IPromotion, '_id'>, Document {}

const localizedTextSchema = new Schema(
  { es: { type: String, required: true }, en: { type: String, required: true } },
  { _id: false },
)

const buttonSchema = new Schema(
  {
    text:   { type: localizedTextSchema, required: true },
    url:    { type: String, required: true },
    target: { type: String, enum: ['_self', '_blank'], default: '_self' },
  },
  { _id: false },
)

const promotionSchema = new Schema<IPromotionDocument>(
  {
    internalName:    { type: String, required: true },
    title:           { type: localizedTextSchema, required: true },
    description:     { type: localizedTextSchema, required: true },
    backgroundImage: { type: String, required: true },
    button:          { type: buttonSchema, required: true },
    position:        { type: String, enum: ['top', 'bottom'], default: 'top' },
    isActive:        { type: Boolean, default: false },
  },
  { timestamps: true },
)

promotionSchema.index({ isActive: 1 })

export const Promotion = model<IPromotionDocument>('Promotion', promotionSchema)
