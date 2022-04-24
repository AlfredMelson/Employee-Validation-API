import express from 'express'
import handleGetEmpl from '../../controllers/emplGetOneController'
const router = express.Router()
// import EmployeeValidator from '../validation/employee'
// import handleRequestValidationErrors from '../middleware/validation'

router.get(
  '/id',

  // validate the request body
  // EmployeeValidator.checkUpdateEmployee(),

  // middleware to handle validator errors
  // handleRequestValidationErrors,

  // handle the request
  handleGetEmpl
)

export default router
