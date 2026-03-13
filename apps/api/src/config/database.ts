import mongoose from 'mongoose'
import { env } from './env'

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI)
    console.warn(`MongoDB connected: ${env.MONGODB_URI}`)
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect()
}
