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
  console.log(`cookie available at login: ${JSON.stringify(cookies)}`)

  // destructure the request body
  const { adminUsername, adminPassword } = req.body

  // check for admin(username) exists in the database
  const foundAdmin = adminDB.admins.find(admin => admin.username === adminUsername)
  console.log('adminAuthController - foundAdmin', foundAdmin)

  // send status 401: 'unauthorized; response means unauthenticated' if no duplicate found
  if (!foundAdmin) return res.sendStatus(401)

  // determine password match using bcrypt to compare the hashed password in the database with the password received via the request
  const match: boolean = await bcrypt.compare(adminPassword, foundAdmin.password)

  if (match) {
    // create jwt accessToken
    console.log('adminAuthController - foundAdmin.username', foundAdmin.username)
    const accessToken: string = createJwtAccessToken(foundAdmin.username)
    console.log('adminAuthController - accessToken', accessToken)

    // create jwt refreshToken
    const newRefreshToken: string = createJwtRefreshToken(foundAdmin.username)
    console.log('adminAuthController - newRefreshToken', newRefreshToken)

    const newRefreshTokenArray = !cookies.jwt ? foundAdmin.refreshToken : foundAdmin.refreshToken
    // administrators.filter(token => token.refreshToken !== cookies.jwt)

    console.log('adminAuthController - newRefreshTokenArray', newRefreshTokenArray)

    // delete cookie
    if (cookies.jwt) {
      // console.log('DELETE COOKIE')
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    }
    // console.log('NO COOKIE TO DELETE')

    // Purpose: save refreshToken with the current admin. This will allow for the creation of a logout route that will invalidate the refreshToken when an admin logs out.  RefreshToken with the current admin is stored in the database and can be cross referenced when it is sent back to create another access token.

    // create currentAdmin object with the foundAdmin and refreshToken set to
    const refreshTokenArray = [...newRefreshTokenArray, newRefreshToken]
    console.log('adminAuthController - refreshTokenArray', refreshTokenArray)

    const authenticatedAdmin = {
      id: foundAdmin.id,
      username: foundAdmin.username,
      password: foundAdmin.password,
      email: foundAdmin.email,
      refreshToken: refreshTokenArray
    }

    console.log('adminAuthController - authenticatedAdmin', authenticatedAdmin)

    // create currentAdmin object with the foundAdmin and their refreshToken
    // const currentAdmin = { ...foundAdmin, refreshToken }

    // create an array of the other admins in the database that are not the current admin
    const otherAdmin = adminDB.admins.filter(admin => admin.username !== foundAdmin.username)

    // check the number of admin in the database
    if (Object.keys(otherAdmin).length === 1) {
      // pass in the current admin as the sole admin to setAdmins
      adminDB.setAdmins(authenticatedAdmin)
    } else {
      // pass in the other admins along with the current admin to setAdmins
      adminDB.setAdmins(authenticatedAdmin)
      // adminDB.setAdmins(...otherAdmin, authenticatedAdmin)
    }

    // format new data to be saved to the database
    // const adminsCombined = adminDB.setAdmins([...otherAdmin, authenticatedAdmin])
    // console.log('adminAuthController - adminsCombined', adminsCombined)

    // const updatedSetAdmins: string = JSON.stringify(adminsCombined)
    // console.log('adminAuthController - updatedSetAdmins', updatedSetAdmins)

    // write the current user to the database
    await fsPromises.writeFile(
      // navigate from the current directory up and into the model directory, to administrators.json
      path.join(__dirname, '..', 'model', 'administrators.json'),

      // specify the data to be written
      JSON.stringify([adminDB.admins])
    )

    // Purpose: send refreshToken in a cookie with httpOnly set to true, prohibiting access from Js this method is more secure than storing refreshToken in local storage or another cookie that is available to Js. NOTE: maxAge is set to 1 day via milliseconds
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    // accesstoken is sent as json, that the FED can use to authenticate the admin. FED needs to store this in memory (react context).
    console.log('adminAuthController - accessToken: ', accessToken)
    res.json({ accessToken })
  } else {
    // send error status 401: 'unauthorized; response means unauthenticated' if password mismatch
    res.sendStatus(401)
  }
}

export default handleAdminAuthentication
