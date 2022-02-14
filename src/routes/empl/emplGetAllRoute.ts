import express from 'express'
import handleGetAllEmpl from '../../controllers/emplGetAllController'
const router = express.Router()
// import EmployeeValidator from '../validation/employee'
// import handleRequestValidationErrors from '../middleware/validation'

router.get(
  '/ids',

  // validate the request body
  // EmployeeValidator.checkUpdateEmployee(),

  // middleware to handle validator errors
  // handleRequestValidationErrors,

  // handle the request
  handleGetAllEmpl
)

export default router
