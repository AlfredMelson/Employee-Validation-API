import type { Request, Response, NextFunction } from 'express'
import approvedOrigins from '../config/approvedOrigins'

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const requestOrigin = req.headers.origin

  // check if the origin exists
  if (requestOrigin) {
    // if origin exists in allowedUrls, allow it
    if (approvedOrigins.includes(requestOrigin)) {
      res.header('Access-Control-Allow-Credentials', 'true')
    }
  }
  next()
}

export default credentials
