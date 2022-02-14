import express, { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import AdministratorValidator from '../validation/administrator'
import handleAdminRegistration from '../controllers/registerController'
const router = express.Router()

router.post(
  '/',

  // validate the request body
  AdministratorValidator.checkCreateAdministrator(),

  // middleware to handle validator errors
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
      return res.json(error)
    }
    next()
  },

  // handle the request
  handleAdminRegistration
)

export default router
