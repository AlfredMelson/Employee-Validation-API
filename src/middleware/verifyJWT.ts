import type { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

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
    // process.env.ACCESS_TOKEN_SECRET,
    '49d602b423a56b281168f50b58d444af414c819ee9d75ff674e6668361123626fc4a67a07e859d76fee75c1fd7c7071b1d28bc798f6e47835d72f8e48ab77972',

    // third: callback with error and decoded options
    (err: any, decoded: any) => {
      // send status 403: 'forbidden; no access rights to the content'; ie invalid token
      if (err) return res.sendStatus(403)

      // set the user equal to the decoded username (passed in the jwt)
      req.user = decoded.username

      // call next from the middleware
      next()
    }
  )
}

export default verifyJWT
