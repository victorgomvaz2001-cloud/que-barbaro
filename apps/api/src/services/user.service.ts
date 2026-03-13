import { User } from '../models/User.model'
import { hashPassword } from '../utils/password.utils'
import type { IUserCreate, IUserUpdate } from '@falcanna/types'

export class UserService {
  async getAll() {
    return User.find().select('-password').lean()
  }

  async create(data: IUserCreate) {
    const existing = await User.findOne({ email: data.email.toLowerCase() })
    if (existing) throw Object.assign(new Error('Email already in use'), { statusCode: 409 })
    const hashed = await hashPassword(data.password)
    const user = await User.create({ ...data, password: hashed })
    const { password: _p, ...rest } = user.toObject()
    return rest
  }

  async getById(id: string) {
    const user = await User.findById(id).select('-password').lean()
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })
    return user
  }

  async update(id: string, data: IUserUpdate) {
    const update: Record<string, unknown> = { ...data }
    if (data.password) {
      update.password = await hashPassword(data.password)
    }
    const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .select('-password')
      .lean()
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })
    return user
  }

  async delete(id: string) {
    const user = await User.findByIdAndDelete(id)
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })
  }
}

export const userService = new UserService()
