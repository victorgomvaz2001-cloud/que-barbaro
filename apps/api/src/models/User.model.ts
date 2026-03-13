import { Schema, model, Document } from 'mongoose'
import type { IUser } from '@falcanna/types'

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  password: string
}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
  },
  { timestamps: true },
)

export const User = model<IUserDocument>('User', userSchema)
