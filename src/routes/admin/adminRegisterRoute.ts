import express from 'express'
import AdministratorValidator from '../../validation/administrator'
import handleAdminRegistration from '../../controllers/adminRegisterController'
import handleRequestValidationErrors from '../../middleware/validation'
const router = express.Router()

router.post(
  '/register',

  // validate the request body
  AdministratorValidator.checkCreateAdministrator(),

  // middleware to handle validator errors
  handleRequestValidationErrors,

  // handle the request
  handleAdminRegistration
)

export default router
