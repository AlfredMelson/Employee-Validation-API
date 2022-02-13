import express from 'express'
import handleAdminLogout from '../controllers/logoutController'
const router = express.Router()

router.get('/', handleAdminLogout)

export default router
