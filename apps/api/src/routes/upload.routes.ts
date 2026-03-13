import { Router, type Router as IRouter } from 'express'
import { getPresignedUrl, listMedia } from '../controllers/upload.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { z } from 'zod'

const router: IRouter = Router()

const presignedUrlSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  folder: z.string().optional(),
})

router.get('/media', authMiddleware, listMedia)
router.post('/presigned-url', authMiddleware, validate(presignedUrlSchema), getPresignedUrl)

export default router
