import express from 'express'
const router = express.Router()
const refreshTokenController = require('../controllers/refreshTokenController')

router.get('/', refreshTokenController.handleUserRefreshToken)

module.exports = router
