import type { Request, Response, NextFunction } from 'express'
import approvedOrigins from '../config/approvedOrigins'

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin: string | undefined = req.headers.origin

  // check if the origin exists
  if (origin) {
    // if origin exists in allowedUrls, allow it
    if (approvedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Credentials', 'true')
    }
  }
  next()
}

export default credentials
