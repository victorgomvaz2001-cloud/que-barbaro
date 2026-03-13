import { Router, type Router as IRouter } from 'express'
import * as userController from '../controllers/user.controller'
import { authMiddleware, requireAdmin } from '../middleware/auth.middleware'

const router: IRouter = Router()

router.use(authMiddleware)

router.get('/', userController.getAll)
router.get('/:id', userController.getById)
router.post('/', requireAdmin, userController.create)
router.put('/:id', requireAdmin, userController.update)
router.delete('/:id', requireAdmin, userController.remove)

export default router
