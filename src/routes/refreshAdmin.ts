import express from 'express'
import handleAdminRefreshToken from '../controllers/refreshTokenController'
const router = express.Router()
// import { validationResult } from 'express-validator'
// import AdministratorValidator from '../validation/administrator'

router.get(
  '/',

  // validate the request body
  //   AdministratorValidator.checkAdminRefreshToken(),

  // middleware to handle validator errors
  //   (req: Request, res: Response, next: NextFunction) => {
  //     const error = validationResult(req)
  //     if (!error.isEmpty()) {
  //       return res.json(error)
  //     }
  //     next()
  //   },

  // handle the request
  handleAdminRefreshToken
)

export default router
