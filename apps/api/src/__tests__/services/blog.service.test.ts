import { BlogService } from '../../services/blog.service'
import { Blog } from '../../models/Blog.model'

jest.mock('../../models/Blog.model')

const mockPost = {
  _id: 'post-id-1',
  title: 'Test Post',
  slug: 'test-post',
  content: 'Content',
  author: 'Author',
  publishedAt: '2026-01-01',
  draft: false,
}

describe('BlogService', () => {
  let blogService: BlogService

  beforeEach(() => {
    blogService = new BlogService()
    jest.clearAllMocks()
  })

  describe('getAll', () => {
    it('returns only published posts by default', async () => {
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockPost]),
      }
      ;(Blog.find as jest.Mock).mockReturnValue(mockFind)

      const posts = await blogService.getAll(false)

      expect(Blog.find).toHaveBeenCalledWith({ draft: false })
      expect(posts).toHaveLength(1)
    })

    it('returns all posts when includesDrafts is true', async () => {
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockPost]),
      }
      ;(Blog.find as jest.Mock).mockReturnValue(mockFind)

      await blogService.getAll(true)

      expect(Blog.find).toHaveBeenCalledWith({})
    })
  })

  describe('getBySlug', () => {
    it('returns post by slug', async () => {
      ;(Blog.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockPost),
      })

      const post = await blogService.getBySlug('test-post')
      expect(post.slug).toBe('test-post')
    })

    it('throws 404 when post not found', async () => {
      ;(Blog.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      })

      await expect(blogService.getBySlug('nonexistent')).rejects.toMatchObject({ statusCode: 404 })
    })
  })

  describe('create', () => {
    it('creates and returns new post', async () => {
      ;(Blog.create as jest.Mock).mockResolvedValue(mockPost)

      const post = await blogService.create({ ...mockPost })
      expect(post._id).toBe('post-id-1')
    })
  })
})
