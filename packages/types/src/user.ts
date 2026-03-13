export type UserRole = 'admin' | 'editor'

export interface IUser {
  _id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface IUserWithPassword extends IUser {
  password: string
}

export type IUserCreate = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'> & { password: string }
export type IUserUpdate = Partial<Omit<IUserCreate, 'email'>>
