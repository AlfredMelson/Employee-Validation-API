import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import administrators from '../model/administrators.json'
import fsPromises from 'fs/promises'
import path from 'path'
import { createJwtRefreshToken } from '../services/tokenManager'

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
  if (!cookies?.jwt) return res.sendStatus(401)

  // define the refreshToken and set it equal to the value within the cookie
  const refreshToken = cookies.jwt

  // delte the cookie after the data has been previously set to refreshToken
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

  // check for admin(username) exists in the database with a refreshToken
  const foundAdmin = adminDB.admins.find(admin => admin.refreshToken === refreshToken)

  console.log('foundAdmin', foundAdmin)

  // check if cookie was received but the admin linked to the refreshToken was not found, meaning that the refreshToken has already been invalidated.  Specifically, removed from the refreshToken array in the db
  if (!foundAdmin) {
    // token verification using jwt.verify
    jwt.verify(
      // first: refreshToken received
      refreshToken,

      // second: refresh secret defined in .env
      // process.env.REFRESH_TOKEN_SECRET,
      'a97a6109f424c526929b5ea4d2a9d17bf36ff15f5f7a610df6f0cad5fdaa58d670a184287054620245017ce1ff5f22c79ee21ef016e6b586e62e6ace5aa73040',

      // third: callback with error and decoded options
      async (err: any, decoded: any) => {
        // if the refreshToken is expired send status 403: 'forbidden; no access rights to the content' if no foundAdmin
        if (err) return res.sendStatus(403)

        // however, if its still a valid refreshToken and someone is attempting to reuse it, then we know there is a problem.  We find the username previously saved in the refreshToken and remove all the refreshTokens associated with that username

        const adminHacked = adminDB.admins.find(admin => admin.username === decoded.username)

        if (adminHacked) {
          console.log('adminHacked', adminHacked)

          // filter out found admin(id) to define otherAdmins
          const otherAdmin = adminDB.admins.filter(admin => admin.id !== adminHacked.id)

          // create hacked admin object with the foundAdmin and refreshToken set to ''
          const hackedAdmin = {
            id: adminHacked.id,
            username: adminHacked.username,
            password: adminHacked.password,
            email: adminHacked.email,
            refreshToken: []
          }

          // check the number of objects
          if (Object.keys(adminDB.admins).length <= 1) {
            // pass in the current admin as the sole admin to setAdmins
            adminDB.setAdmins(hackedAdmin)
          } else {
            // pass in the other admins along with the current admin to setAdmins
            adminDB.setAdmins([...otherAdmin, hackedAdmin])
          }

          // write the current user to the database
          await fsPromises.writeFile(
            // navigate from the current directory up and into the model directory, to administrators.json
            path.join(__dirname, '..', 'model', 'administrators.json'),

            // specify the data to be written
            JSON.stringify(adminDB.admins)
          )
        }
      }
    )

    //Forbidden
    return res.sendStatus(403)
  }

  // we have found the refreshToken, its valid and we are ready to reissue a new refreshToken
  // we still need to remove the old refreshToken from the refreshToken array in the db
  const newRefreshTokenArray = adminDB.admins.filter(
    admin => admin.refreshToken !== foundAdmin.refreshToken
  )

  // token verification using jwt.verify
  jwt.verify(
    // first: refreshToken received
    refreshToken,

    // second: refresh secret defined in .env
    // process.env.REFRESH_TOKEN_SECRET,
    'a97a6109f424c526929b5ea4d2a9d17bf36ff15f5f7a610df6f0cad5fdaa58d670a184287054620245017ce1ff5f22c79ee21ef016e6b586e62e6ace5aa73040',

    // third: callback with error and decoded options
    async (err: any, decoded: any) => {
      if (err) {
        console.log('expired refresh token')

        // handle receiving an expired refreshToken that is being replaced
        // filter out found admin(id) to define otherAdmins
        const otherAdmin = adminDB.admins.filter(admin => admin.id !== foundAdmin.id)

        // create hacked admin object with the foundAdmin and refreshToken set to ''
        const updatedfoundAdmin = {
          id: foundAdmin.id,
          username: foundAdmin.username,
          password: foundAdmin.password,
          email: foundAdmin.email,
          refreshToken: [...newRefreshTokenArray]
        }

        // check the number of objects
        if (Object.keys(adminDB.admins).length <= 1) {
          // pass in the current admin as the sole admin to setAdmins
          adminDB.setAdmins(updatedfoundAdmin)
        } else {
          // pass in the other admins along with the current admin to setAdmins
          adminDB.setAdmins([...otherAdmin, updatedfoundAdmin])
        }

        // write the current user to the database
        await fsPromises.writeFile(
          // navigate from the current directory up and into the model directory, to administrators.json
          path.join(__dirname, '..', 'model', 'administrators.json'),

          // specify the data to be written
          JSON.stringify(adminDB.admins)
        )
      }

      // send status 403: 'forbidden; no access rights to the content'; ie invalid token or the foundUser username is not the same as the decoded username
      if (err || foundAdmin.username !== decoded.username) return res.sendStatus(403)

      // refreshToken was still valid and the username is the same as the decoded username, so we can issue a new accessToken and refreshToken

      // set the admin equal to the decoded username (passed in the jwt) along with the accessToken
      const accessToken = jwt.sign(
        { username: decoded.username },

        // process.env.ACCESS_TOKEN_SECRET,
        '49d602b423a56b281168f50b58d444af414c819ee9d75ff674e6668361123626fc4a67a07e859d76fee75c1fd7c7071b1d28bc798f6e47835d72f8e48ab77972',
        {
          expiresIn: '15s'
        }
      )

      // create new jwt refreshToken
      const newRefreshToken = createJwtRefreshToken(foundAdmin.username)

      // Purpose: save refreshToken with the current admin. This will allow for the creation of a logout route that will invalidate the refreshToken when an admin logs out.  RefreshToken with the current admin is stored in the database and can be cross referenced when it is sent back to create another access token.

      // create currentAdmin object with the foundAdmin and refreshToken set to ''
      const loggedInAdmin = {
        id: foundAdmin.id,
        username: foundAdmin.username,
        password: foundAdmin.password,
        email: foundAdmin.email,
        refreshToken: [...newRefreshTokenArray, newRefreshToken]
      }

      // create currentAdmin object with the foundAdmin and their refreshToken
      // const currentAdmin = { ...foundAdmin, refreshToken }

      // create an array of the other admins in the database that are not the current admin
      const otherAdmin = adminDB.admins.filter(admin => admin.username !== foundAdmin.username)

      // check the number of objects
      if (Object.keys(adminDB.admins).length <= 1) {
        // pass in the current admin as the sole admin to setAdmins
        adminDB.setAdmins([loggedInAdmin])
      } else {
        // pass in the other admins along with the current admin to setAdmins
        adminDB.setAdmins([...otherAdmin, loggedInAdmin])
      }

      // write the current user to the database
      await fsPromises.writeFile(
        // navigate from the current directory up and into the model directory, to administrators.json
        path.join(__dirname, '..', 'model', 'administrators.json'),

        // specify the data to be written
        JSON.stringify(adminDB.admins)
      )

      // Purpose: send newRefreshToken in a cookie with httpOnly set to true, prohibiting access from Js this method is more secure than storing refreshToken in local storage or another cookie that is available to Js. NOTE: maxAge is set to 1 day via milliseconds
      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
      })

      // accesstoken is sent as json, that the FED can use to authenticate the admin. FED needs to store this in memory.
      res.json({ accessToken })
    }
  )
}

export default handleAdminRefreshToken
