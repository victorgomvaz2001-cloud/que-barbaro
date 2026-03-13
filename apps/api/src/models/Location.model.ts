import { Schema, model, Document } from 'mongoose'
import type { ILocation } from '@falcanna/types'

export interface ILocationDocument extends Omit<ILocation, '_id'>, Document {}

const locationSchema = new Schema<ILocationDocument>(
  {
    name: { type: String, required: true },
    region: { type: String, enum: ['us-wa', 'us-ok'], required: true },
    address: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    phone: String,
    email: String,
    hours: String,
  },
  { timestamps: true },
)

locationSchema.index({ region: 1 })

export const Location = model<ILocationDocument>('Location', locationSchema)
