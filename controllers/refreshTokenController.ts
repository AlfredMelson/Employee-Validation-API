import { Request, Response } from 'express'
// modeled after useState in react with users & setUsers
export const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data
  }
}
const jwt = require('jsonwebtoken')
require('dotenv').config()

const handleUserRefreshToken = (req: Request, res: Response) => {
  // set cookies to the request cookies
  const cookies = req.cookies

  // check that there are no cookies or (optionally chaining) for a jwt property and send status 401 if true: 'unauthorized; response means unauthenticated'
  if (!cookies?.jwt) return res.sendStatus(401)

  // define the refreshToken and set it equal to value received
  const refreshToken = cookies.jwt

  // check for user(username) exists in the database with a refreshToken
  const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)

  // send status 403: 'forbidden; no access rights to the content' if no foundUser
  if (!foundUser) return res.sendStatus(403)

  // token verification using jwt.verify
  jwt.verify(
    // first: refreshToken received
    refreshToken,
    // second: refresh secret defined in .env
    process.env.REFRESH_TOKEN_SECRET,
    // third: callback with error and decoded options
    (err, decoded) => {
      // send status 403: 'forbidden; no access rights to the content'; ie invalid token or the foundUser username is not the same as the decoded username
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403)

      // set the user equal to the decoded username (passed in the jwt) along with the accessToken
      const accessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '10m'
        }
      )

      // accesstoken is sent as json, that the FED can use to authenticate the user. FED needs to store this in memory.
      res.json({ accessToken })
    }
  )
}

module.exports = { handleUserRefreshToken }
