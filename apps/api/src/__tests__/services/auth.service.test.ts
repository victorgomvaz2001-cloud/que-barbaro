import { AuthService } from '../../services/auth.service'
import { User } from '../../models/User.model'
import * as passwordUtils from '../../utils/password.utils'
import * as jwtUtils from '../../utils/jwt.utils'

jest.mock('../../models/User.model')
jest.mock('../../utils/password.utils')
jest.mock('../../utils/jwt.utils')

const mockUser = {
  id: 'user-id-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin' as const,
  password: 'hashed-password',
}

describe('AuthService', () => {
  let authService: AuthService

  beforeEach(() => {
    authService = new AuthService()
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('returns token and user on valid credentials', async () => {
      ;(User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      })
      ;(passwordUtils.comparePassword as jest.Mock).mockResolvedValue(true)
      ;(jwtUtils.signToken as jest.Mock).mockReturnValue('mock-token')

      const result = await authService.login('test@example.com', 'password123')

      expect(result.token).toBe('mock-token')
      expect(result.user.email).toBe('test@example.com')
    })

    it('throws 401 when user not found', async () => {
      ;(User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      })

      await expect(authService.login('bad@example.com', 'pass')).rejects.toMatchObject({
        statusCode: 401,
      })
    })

    it('throws 401 on invalid password', async () => {
      ;(User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      })
      ;(passwordUtils.comparePassword as jest.Mock).mockResolvedValue(false)

      await expect(authService.login('test@example.com', 'wrong')).rejects.toMatchObject({
        statusCode: 401,
      })
    })
  })

  describe('register', () => {
    it('creates user and returns token', async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue(null)
      ;(passwordUtils.hashPassword as jest.Mock).mockResolvedValue('hashed')
      ;(User.create as jest.Mock).mockResolvedValue(mockUser)
      ;(jwtUtils.signToken as jest.Mock).mockReturnValue('new-token')

      const result = await authService.register({
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
        role: 'editor',
      })

      expect(result.token).toBe('new-token')
    })

    it('throws 409 when email already exists', async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)

      await expect(
        authService.register({ email: 'test@example.com', password: 'pass', name: 'X', role: 'editor' }),
      ).rejects.toMatchObject({ statusCode: 409 })
    })
  })
})
