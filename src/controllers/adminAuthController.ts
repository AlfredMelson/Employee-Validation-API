import fsPromises from 'fs/promises'
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { createJwtAccessToken, createJwtRefreshToken } from '../services/tokenManager'
import administrators from '../model/administrators.json'
import path from 'path'

const adminDB = {
  admins: administrators,
  setAdmins: function (data: any) {
    this.admins = data
  }
}
const handleAdminAuthentication = async (req: Request, res: Response) => {
  // define cookies and grab it if it exists
  const cookies = req?.cookies

  // destructure the request body
  const { adminUsername, adminPassword } = req.body

  // check if admin exists in the database via username
  const foundAdmin = adminDB.admins.find(
    (admin: { username: any }) => admin.username === adminUsername
  )

  // send status 401: 'unauthorized; response means unauthenticated' if no duplicate found
  if (!foundAdmin) return res.sendStatus(401)

  // determine password match using bcrypt to compare the hashed password in the database with the password received via the request
  const match: boolean = await bcrypt.compare(adminPassword, foundAdmin.password)

  if (match) {
    // create jwt accessToken
    const accessToken: string = createJwtAccessToken(foundAdmin.username)

    // create jwt refreshToken
    const newRefreshToken: string = createJwtRefreshToken(foundAdmin.username)

    let newRefreshTokenArray = !cookies?.jwt
      ? foundAdmin.refreshToken
      : foundAdmin.refreshToken.filter((token: any) => token !== cookies.jwt)

    // delete cookie
    if (cookies?.jwt) {
      /* 
       Scenario added here: 
       1) Admin logs in but never utilises refresh token and does not logout 
       2) refresh token is stolen
       3) If 1 & 2, reuse detection is needed to clear all refresh tokens when admin logs in
     */
      const refreshToken = cookies.jwt

      // lookup refresh token in the database
      const foundToken = foundAdmin.refreshToken.find((admin: string | any[]) =>
        admin.includes(refreshToken)
      )

      // Detected refresh token reuse!
      if (!foundToken) {
        // remove previous refresh tokens
        newRefreshTokenArray = []
      }

      res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    }
    // Purpose: save refreshToken with the current admin. This will allow for the creation of a logout route that will invalidate the refreshToken when an admin logs out.  RefreshToken with the current admin is stored in the database and can be cross referenced when it is sent back to create another access token.

    // create currentAdmin object with the foundAdmin and refreshToken set to
    const refreshTokenArray = [...newRefreshTokenArray, newRefreshToken]

    const authenticatedAdmin = {
      ...foundAdmin,
      refreshToken: refreshTokenArray
    }

    // create an array of the other admins in the database that are not the current admin
    const otherAdmin = adminDB.admins.filter(admin => admin.email !== foundAdmin.email)

    // check the number of admins in the database
    if (adminDB.admins.length <= 1) {
      // pass in the current admin as the sole admin to setAdmins
      adminDB.setAdmins([authenticatedAdmin])
    } else {
      // pass in the other admins along with the current admin to setAdmins
      const allAdmin = [...otherAdmin, authenticatedAdmin]
      adminDB.setAdmins(allAdmin)
    }

    // Purpose: send refreshToken in a cookie with httpOnly set to true, prohibiting javascript access. This method is more secure than storing refreshToken in local storage or another cookie that is available to javascript. NOTE: maxAge is set to 1 day via milliseconds
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    // accesstoken is sent as json, that the FED can use to authenticate the admin. FED needs to store this in memory (react context).
    res.json(accessToken)

    // send error status 401: 'unauthorized; response means unauthenticated' if password mismatch
  } else {
    res.sendStatus(401)
  }

  // update the database with current administrators
  await fsPromises.writeFile(
    // navigate from the current directory up and into the model directory, to administrators.json
    path.join(__dirname, '..', 'model', 'administrators.json'),

    // specify the data to be written
    JSON.stringify(adminDB.admins)
  )
}

export default handleAdminAuthentication
