import express from 'express'
const router = express.Router()
const logoutController = require('../controllers/logoutController')

router.get('/', logoutController.handleUserLogout)

module.exports = router
