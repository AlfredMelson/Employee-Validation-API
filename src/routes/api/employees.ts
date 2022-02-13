import express from 'express'
import {
  createNewEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee
} from '../../controllers/employeesController'
const router = express.Router()

router
  .route('/')
  .get(getAllEmployees)
  .post(createNewEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee)

router.route('/:id').get(getEmployee)

export default router
