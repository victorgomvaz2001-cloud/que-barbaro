import { Router, type Router as IRouter } from 'express'
import * as galleryController from '../controllers/gallery.controller'
import * as galleryCategoryController from '../controllers/galleryCategory.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router: IRouter = Router()

// Public — photos
router.get('/',                 galleryController.getPage)
router.get('/section/:section', galleryController.getBySection)

// Public — categories
router.get('/categories',       galleryCategoryController.getAll)

// Admin — photos
router.get('/admin/list',       authMiddleware, galleryController.getAll)
router.post('/admin',           authMiddleware, galleryController.create)
router.put('/admin/:id',        authMiddleware, galleryController.update)
router.delete('/admin/:id',     authMiddleware, galleryController.remove)

// Admin — categories
router.get('/admin/categories',        authMiddleware, galleryCategoryController.getAllAdmin)
router.post('/admin/categories',       authMiddleware, galleryCategoryController.create)
router.put('/admin/categories/:id',    authMiddleware, galleryCategoryController.update)
router.delete('/admin/categories/:id', authMiddleware, galleryCategoryController.remove)

export default router
