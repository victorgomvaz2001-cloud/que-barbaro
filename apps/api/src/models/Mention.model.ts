import { Schema, model, Document } from 'mongoose'
import type { IMention, IMentionConfig } from '@falcanna/types'

export interface IMentionDocument extends Omit<IMention, '_id'>, Document {}

const mentionSchema = new Schema<IMentionDocument>(
  {
    name:    { type: String, required: true },
    logoUrl: { type: String, required: true },
    link:    { type: String, required: true },
    order:   { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
)

mentionSchema.index({ visible: 1, order: 1 })

export const Mention = model<IMentionDocument>('Mention', mentionSchema)

/* ── Config singleton ───────────────────────────────────────────────────── */

export interface IMentionConfigDocument extends IMentionConfig, Document {}

const mentionConfigSchema = new Schema<IMentionConfigDocument>(
  {
    maxDisplay: { type: Number, default: 0 }, // 0 = show all visible
  },
  { timestamps: true },
)

export const MentionConfig = model<IMentionConfigDocument>('MentionConfig', mentionConfigSchema)
