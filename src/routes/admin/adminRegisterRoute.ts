import { createAdminSchema } from '../../scheme/administrators.schema'
import express from 'express'
import handleAdminRegistration from '../../controllers/adminRegisterController'
import validateResource from '../../middleware/validateResource'
// import AdministratorValidator from '../../validation/administrator'
// import handleRequestValidationErrors from '../../middleware/validation'

const router = express.Router()

router.post(
  '/register',

  // validate the request body
  // AdministratorValidator.checkCreateAdministrator(),
  validateResource(createAdminSchema),

  // middleware to handle validator errors
  // handleRequestValidationErrors,

  // handle the request
  handleAdminRegistration
)

export default router
