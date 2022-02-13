import express from 'express'
import handleAdminRefreshToken from '../controllers/refreshTokenController'
const router = express.Router()

router.get('/', handleAdminRefreshToken)

export default router
