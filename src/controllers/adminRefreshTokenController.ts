import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import administrators from '../model/administrators.json'

// modeled after useState in react with admins & setAdmins
const adminDB = {
  admins: administrators,
  setAdmins: function (data: any) {
    this.admins = data
  }
}

const handleAdminRefreshToken = (req: Request, res: Response) => {
  // set cookies to the request cookies
  const cookies = req.cookies

  // check that there are no cookies or "optionally chained" jwt property and send status 401 if true: 'unauthorized; response means unauthenticated'
  if (!cookies.jwt) return res.sendStatus(401)

  // define the refreshToken and set it equal to value received
  const refreshToken = cookies.jwt

  // check for admin(username) exists in the database with a refreshToken
  const foundAdmin = adminDB.admins.find(admin => admin.refreshToken === refreshToken)

  // send status 403: 'forbidden; no access rights to the content' if no foundAdmin
  if (!foundAdmin) return res.sendStatus(403)

  // token verification using jwt.verify
  jwt.verify(
    // first: refreshToken received
    refreshToken,

    // second: refresh secret defined in .env
    // process.env.REFRESH_TOKEN_SECRET,
    'a97a6109f424c526929b5ea4d2a9d17bf36ff15f5f7a610df6f0cad5fdaa58d670a184287054620245017ce1ff5f22c79ee21ef016e6b586e62e6ace5aa73040',

    // third: callback with error and decoded options
    (err: any, decoded: any) => {
      // send status 403: 'forbidden; no access rights to the content'; ie invalid token or the foundUser username is not the same as the decoded username
      if (err || foundAdmin.username !== decoded.username) return res.sendStatus(403)

      // set the admin equal to the decoded username (passed in the jwt) along with the accessToken
      const accessToken = jwt.sign(
        { username: decoded.username },

        // process.env.ACCESS_TOKEN_SECRET,
        '49d602b423a56b281168f50b58d444af414c819ee9d75ff674e6668361123626fc4a67a07e859d76fee75c1fd7c7071b1d28bc798f6e47835d72f8e48ab77972',
        {
          expiresIn: '15s'
        }
      )

      // accesstoken is sent as json, that the FED can use to authenticate the admin. FED needs to store this in memory.
      res.json({ accessToken })
    }
  )
}

export default handleAdminRefreshToken
