import { Router, type Router as IRouter } from 'express'
import authRoutes from './auth.routes'
import seoRoutes from './seo.routes'
import blogRoutes from './blog.routes'
import locationRoutes from './location.routes'
import userRoutes from './user.routes'
import uploadRoutes from './upload.routes'

const router: IRouter = Router()

router.use('/auth', authRoutes)
router.use('/seo', seoRoutes)
router.use('/blog', blogRoutes)
router.use('/locations', locationRoutes)
router.use('/admin/users', userRoutes)
router.use('/admin/upload', uploadRoutes)

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
