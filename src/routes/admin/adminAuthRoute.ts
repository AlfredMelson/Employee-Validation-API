import express from 'express'
import AdministratorValidator from '../../validation/administrator'
import handleAdminAuthentication from '../../controllers/adminAuthController'
import handleRequestValidationErrors from '../../middleware/validation'
const router = express.Router()

router.post(
  '/auth',

  // validate the request body
  AdministratorValidator.checkAuthAdministrator(),

  // middleware to handle validator errors
  handleRequestValidationErrors,

  // handle the request
  handleAdminAuthentication
)

export default router
