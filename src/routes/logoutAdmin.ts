import express from 'express'
import handleAdminLogout from '../controllers/logoutController'
const router = express.Router()
// import { validationResult } from 'express-validator'
// import AdministratorValidator from '../validation/administrator'

router.get(
  '/',

  // validate the request body
  //   AdministratorValidator.checkRemoveAdministrator(),

  // middleware to handle validator errors
  //   (req: Request, res: Response, next: NextFunction) => {
  //     const error = validationResult(req)
  //     if (!error.isEmpty()) {
  //       return res.json(error)
  //     }
  //     next()
  //   },

  // handle the request
  handleAdminLogout
)

export default router
