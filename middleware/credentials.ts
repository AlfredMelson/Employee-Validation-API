import { Request, Response, NextFunction } from 'express'

export const credentials = (req: Request, res: Response, next: NextFunction) => {
  const whitelistedOrigin = ['http://localhost:3000']
  const origin = req.headers.origin
  if (whitelistedOrigin.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true')
  }
  next()
}

module.exports = credentials
