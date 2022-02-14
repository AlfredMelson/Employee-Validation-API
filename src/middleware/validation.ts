import type { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

const handleRequestValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return res.json(error.array()[0])
  }
  next()
}

export default handleRequestValidationErrors
