import express from 'express'
import handleGetAllAdmin from '../../controllers/adminGetAllController'
const router = express.Router()
// import AdministratorValidator from '../../validation/administrator'
// import handleRequestValidationErrors from '../../middleware/validation'

router.get(
  '/ids',

  // validate the request body
  // AdminValidator.checkGetAllAdmin(),

  // middleware to handle validator errors
  // handleRequestValidationErrors,

  // handle the request
  handleGetAllAdmin
)

export default router
