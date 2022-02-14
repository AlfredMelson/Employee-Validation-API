import express from 'express'
import handleEmplDeletion from '../../controllers/emplDeletionController'
const router = express.Router()
// import EmployeeValidator from '../validation/employee'
// import handleRequestValidationErrors from '../middleware/validation'

router.post(
  '/delete',

  // validate the request body
  // EmployeeValidator.checkUpdateEmployee(),

  // middleware to handle validator errors
  // handleRequestValidationErrors,

  // handle the request
  handleEmplDeletion
)

export default router
