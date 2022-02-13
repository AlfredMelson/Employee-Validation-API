import express from 'express'
import handleAdminAuthentication from '../controllers/authController'
const router = express.Router()

router.post('/', handleAdminAuthentication)

export default router
