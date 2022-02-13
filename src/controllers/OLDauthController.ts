import type { Request, Response } from 'express'
import path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { writeFile } from 'fs'
import administrators from '../model/administrators.json'
import { createJwtAccessToken, createJwtRefreshToken } from '../services/tokenManager'

// modeled after useState in react with administrators & setAdministrators
const adminDB = {
  administrators: administrators,
  setAdministrators: function (data: any) {
    this.administrators = data
  }
}

const handleAdminAuthentication = async (req: Request, res: Response) => {
  // destructure the request body
  const { user, pwd } = req.body

  // check for missing username or password and send status 400 if true: 'server could not understand the request due to invalid syntax'
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' })

  // check for admin(username) exists in the database
  const foundAdmin = adminDB.administrators.find(admin => admin.username === user)

  // send status 401: 'unauthorized; response means unauthenticated' if no duplicate found
  if (!foundAdmin) return res.sendStatus(401)

  // evaluate password using bcrypt to compare the hashed password in the database with the password received via the request
  const match = await bcrypt.compare(pwd, foundAdmin.password)

  // handle password match senerio
  if (match) {
    // create jwt accessToken
    createJwtAccessToken(foundAdmin.username)

    // create jwt refreshToken
    createJwtRefreshToken(foundAdmin.username)

    // Purpose: save refreshToken with the current admin. This will allow for the creation of a logout route that will invalidate the refreshToken when a admin logs out.  RefreshToken with the current admin in a database that can be cross referenced when it is sent back to create another access token.

    // create an array of the other admins in the database that are not the admin logged in
    const otherAdmins = adminDB.administrators.filter(
      admin => admin.username !== foundAdmin.username
    )

    // create currentAdmin object with the foundAdmin and their refreshToken
    const currentAdmin = { ...foundAdmin, refreshToken }

    // pass in the other admins along with the logged in admin to setAdministrators
    adminDB.setAdministrators([...otherAdmins, currentAdmin])

    // write the current admin to the database
    writeFile(
      path.join(__dirname, '..', 'model', 'administrators.json'), // users.json
      JSON.stringify(adminDB.administrators),
      err => {
        if (err) throw err
        console.log('The file has been saved!')
      }
    )

    // Purpose: send refreshToken in a cookie with httpOnly set to true, prohibiting access from Js this method is more secure than storing refreshToken in local storage or another cookie that is available to Js. NOTE: maxAge is set to 1 day via milliseconds
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    // accesstoken is sent as json, that the FED can use to authenticate the user.
    // NOTE: FED needs to store this in memory.
    res.json({ accessToken })
  } else {
    // send status 401: 'unauthorized; response means unauthenticated' if password mismatch
    res.sendStatus(401)
  }
}

export default handleAdminAuthentication
