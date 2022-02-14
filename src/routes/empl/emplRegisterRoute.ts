import express from 'express'
import handleEmplRegistration from '../../controllers/emplRegisterController'
const router = express.Router()
// import EmployeeValidator from '../validation/1mployee'
// import handleRequestValidationErrors from '../middleware/validation'

router.post(
  '/register',

  // validate the request body
  // EmployeeValidator.checkCreateEmployee(),

  // middleware to handle validator errors
  // handleRequestValidationErrors,

  // handle the request
  handleEmplRegistration
)

export default router
