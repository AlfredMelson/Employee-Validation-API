import express from 'express'
import handleNewAdminRegistration from '../controllers/registerController'
const router = express.Router()

router.post('/', handleNewAdminRegistration)

export default router
