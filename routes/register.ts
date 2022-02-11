import express from 'express'
const router = express.Router()
const registerController = require('../controllers/registerController')

router.post('/', registerController.handleNewUserRegistration)

module.exports = router
