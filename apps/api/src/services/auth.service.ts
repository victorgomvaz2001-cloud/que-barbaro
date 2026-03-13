import { User } from '../models/User.model'
import { hashPassword, comparePassword } from '../utils/password.utils'
import { signToken } from '../utils/jwt.utils'
import type { IUserCreate } from '@falcanna/types'

export class AuthService {
  async login(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
    }

    const isValid = await comparePassword(password, user.password as string)
    if (!isValid) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
    }

    const token = signToken({ userId: user.id as string, email: user.email, role: user.role })

    return {
      token,
      user: { _id: user.id as string, email: user.email, name: user.name, role: user.role },
    }
  }

  async register(data: IUserCreate) {
    const existing = await User.findOne({ email: data.email.toLowerCase() })
    if (existing) {
      throw Object.assign(new Error('Email already registered'), { statusCode: 409 })
    }

    const hashed = await hashPassword(data.password)
    const user = await User.create({ ...data, password: hashed })

    const token = signToken({ userId: user.id as string, email: user.email, role: user.role })

    return {
      token,
      user: { _id: user.id as string, email: user.email, name: user.name, role: user.role },
    }
  }
}

export const authService = new AuthService()
