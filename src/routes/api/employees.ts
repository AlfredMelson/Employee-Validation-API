import express from 'express'
const router = express.Router()
import {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee
} from '../../controllers/employeesController'

router
  .route('/')
  .get(getAllEmployees)
  .post(createNewEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee)

router.route('/:id').get(getEmployee)

export default router
