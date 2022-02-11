import { Response, NextFunction } from 'express'
const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req: any, res: Response, next: NextFunction) => {
  // req.header can receive both capitalization cases
  const authHeader = req.headers['authorization'] || req.headers['Authorization']

  // send status 401: 'unauthorized; response means unauthenticated' if no authHeader
  if (!authHeader) return res.sendStatus(401)

  console.log('authHeader:', authHeader) // Bearer token...

  // define the token, setting it equal to authHeader after the word 'Bearer': position 1
  const token = authHeader.split(' ')[1]

  // token verification using jwt.verify
  jwt.verify(
    // first: token
    token,

    // second: access secret defined in .env
    process.env.ACCESS_TOKEN_SECRET,

    // third: callback with error and decoded options
    (err, decoded) => {
      // send status 403: 'forbidden; no access rights to the content'; ie invalid token
      if (err) return res.sendStatus(403)

      // set the user equal to the decoded username (passed in the jwt)
      req.user = decoded.username

      // finally call next from the middleware
      next()
    }
  )
}

module.exports = verifyJWT
