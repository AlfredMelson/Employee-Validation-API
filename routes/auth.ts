import express from 'express'
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/', authController.handleUserAuthentication)

module.exports = router
