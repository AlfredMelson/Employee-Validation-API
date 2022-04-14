import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import administrators from '../model/administrators.json'
import fsPromises from 'fs/promises'
import path from 'path'
import { createJwtAccessToken, createJwtRefreshToken } from '../services/tokenManager'
import { IAdmin } from '../model/administrators'

const adminDB = {
  admins: administrators,
  setAdmins: function (data: any) {
    this.admins = data
  }
}

const handleAdminRefreshToken = (req: Request, res: Response) => {
  // set cookies to the request cookies
  const cookies = req.cookies
  console.log(`cookie available at refresh: ${JSON.stringify(cookies)}`)

  // check that there are no cookies or "optionally chained" jwt property and send status 401 if true: 'unauthorized; response means unauthenticated'
  if (!cookies?.jwt) return res.sendStatus(401)

  // set refreshToken equal to the value within the cookie
  const refreshToken = cookies.jwt

  // delete the cookie after the data has updated the refreshToken
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

  // check if admin exists in the database with the refreshToken received
  const foundAdmin = adminDB.admins.find(admin => admin.refreshToken === refreshToken)

  // Reuse of refreshToken Detected: 1. Decode the refreshToken and look for username. 2. If found delete all refreshToekens assocated with that account.
  if (!foundAdmin) {
    // token verification using jwt.verify
    jwt.verify(
      // first: refreshToken received
      refreshToken,

      // second: refresh secret defined in .env
      // process.env.REFRESH_TOKEN_SECRET,
      'a97a6109f424c526929b5ea4d2a9d17bf36ff15f5f7a610df6f0cad5fdaa58d670a184287054620245017ce1ff5f22c79ee21ef016e6b586e62e6ace5aa73040',

      // third: callback with error and decoded options via async call to the database
      async (error: any, decoded: any) => {
        // An error will be thrown if the refreshToken cannot be decoded and status 403 is sent: 'forbidden; no access rights to the content'
        if (error) return res.sendStatus(403)

        // Handle a hack: we now know that someone is attempting to use an invalidated refreshToken (because it was used before).  With the refreshToekn rotation in place, we are able to invalidate a token, letting us know that this is a reuse attempt; which we don't want.

        // Identify the username previously saved in the refreshToken and remove all the refreshTokens associated with that username.
        const adminHacked = adminDB.admins.find(admin => admin.username === decoded.username)

        // There will be refreshToken for each device that the admin has logged into. If we detect reuse, the admin is forced to log in again on each device as soon as their access toekn expires.  Note: the admin could be logged out faster by also removing the accessToken from the database.
        const hackedAdminRefreshTokenArray: string[] = []

        // recreate the hacked admin and set refreshToken to an empty array
        if (adminHacked) {
          const hackedAdmin: IAdmin = {
            id: adminHacked.id,
            username: adminHacked.username,
            password: adminHacked.password,
            email: adminHacked.email,
            refreshToken: hackedAdminRefreshTokenArray
          }

          // create an array of the other admins in the database that are not the hacked admin
          const otherAdmin = adminDB.admins.filter(admin => admin.id !== adminHacked.id)

          // check the number of admins in the database
          if (adminDB.admins.length <= 1) {
            // pass in the current admin as the sole admin to setAdmins
            adminDB.setAdmins(hackedAdmin)
          } else {
            // pass in the other admins along with the current admin to setAdmins
            const allAdmin = [...otherAdmin, hackedAdmin]
            adminDB.setAdmins(allAdmin)
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

    // status 403 is sent: 'forbidden; no access rights to the content'
    return res.sendStatus(403)
  }

  // Handle the found refreshToken and its valid and ready to issue a new refreshToken. But first the old refreshToken needs to be removed from the refreshToken array in the db
  const newRefreshTokenArray = foundAdmin.refreshToken.filter(admin => admin !== refreshToken)

  console.log('newRefreshTokenArray', newRefreshTokenArray)

  // token verification using jwt.verify
  jwt.verify(
    // first: refreshToken received
    refreshToken,

    // second: refresh secret defined in .env
    // process.env.REFRESH_TOKEN_SECRET,
    'a97a6109f424c526929b5ea4d2a9d17bf36ff15f5f7a610df6f0cad5fdaa58d670a184287054620245017ce1ff5f22c79ee21ef016e6b586e62e6ace5aa73040',

    // third: callback with error and decoded options via async call to the database
    async (error: any, decoded: any) => {
      if (error) {
        // handle receiving an expired refreshToken that is being replaced

        // recreate the found admin and set refreshToken to the new refreshToken array
        const updatedfoundAdmin = {
          id: foundAdmin.id,
          username: foundAdmin.username,
          password: foundAdmin.password,
          email: foundAdmin.email,
          refreshToken: [...newRefreshTokenArray]
        }

        // create an array of the other admins in the database that are not the found admin
        const otherAdmin = adminDB.admins.filter(admin => admin.id !== foundAdmin.id)

        // check the number of admins in the database
        if (adminDB.admins.length <= 1) {
          // pass in the current admin as the sole admin to setAdmins
          adminDB.setAdmins(updatedfoundAdmin)
        } else {
          // pass in the other admins along with the current admin to setAdmins
          const allAdmin = [...otherAdmin, updatedfoundAdmin]
          adminDB.setAdmins(allAdmin)
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
      if (error || foundAdmin.username !== decoded.username) return res.sendStatus(403)

      // refreshToken was still valid and the username is the same as the decoded username; issue a new accessToken and refreshToken. Set the admin equal to the decoded username (passed in the jwt) along with the accessToken

      // create new accessToken
      const accessToken = createJwtAccessToken(decoded.username)

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

      // accesstoken is sent as json, that the FED can use to authenticate the admin. NOTE: FED needs to store this in memory.
      res.json(accessToken)
    }
  )
}

export default handleAdminRefreshToken
