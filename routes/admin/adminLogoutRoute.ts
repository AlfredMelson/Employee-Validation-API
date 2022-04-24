import express from 'express'
import handleAdminLogout from '../../controllers/adminLogoutController'
// import AdministratorValidator from '../../validation/administrator'
// import handleRequestValidationErrors from '../../middleware/validation'
const router = express.Router()

router.get(
  '/logout',

  // validate the request body
  //   AdministratorValidator.checkRemoveAdministrator(),

  // middleware to handle validator errors
  // handleRequestValidationErrors,

  // handle the request
  handleAdminLogout
)

export default router
