import express from 'express'
import handleEmplUpdate from '../../controllers/emplUpdateController'
const router = express.Router()
// import EmployeeValidator from '../validation/employee'
// import handleRequestValidationErrors from '../middleware/validation'

router.post(
  '/update',

  // validate the request body
  // EmployeeValidator.checkUpdateEmployee(),

  // middleware to handle validator errors
  // handleRequestValidationErrors,

  // handle the request
  handleEmplUpdate
)

export default router
