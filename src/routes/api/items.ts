import express from 'express'
import { getAllItems, updateItem } from '../../controllers/itemsController'
const router = express.Router()

router
  .route('/')
  .get(getAllItems)
  // .post(createNewItem)
  .put(updateItem)
// .delete(deleteItem)

export default router
