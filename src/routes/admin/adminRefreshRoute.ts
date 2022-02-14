import express from 'express'
import handleAdminRefreshToken from '../../controllers/adminRefreshTokenController'
// import AdministratorValidator from '../../validation/administrator'
// import handleRequestValidationErrors from '../../middleware/validation'
const router = express.Router()

router.get(
  '/refresh',

  // validate the request body
  //   AdministratorValidator.checkAdminRefreshToken(),

  // middleware to handle validator errors
  // handleRequestValidationErrors,

  // handle the request
  handleAdminRefreshToken
)

export default router
