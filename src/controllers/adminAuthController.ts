import fsPromises from 'fs/promises'
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { createJwtAccessToken, createJwtRefreshToken } from '../services/tokenManager'
import administrators from '../model/administrators.json'
import path from 'path'

// modeled after useState in react with administrators & setAdministrators
const adminDB = {
  admins: administrators,
  setAdmins: function (data: any) {
    this.admins = data
  }
}

const handleAdminAuthentication = async (req: Request, res: Response) => {
  // destructure the request body
  const { adminUsername, adminPassword } = req.body

  // check for admin(username) exists in the database
  const foundAdmin = adminDB.admins.find((admin: any) => admin.username === adminUsername)

  // send status 401: 'unauthorized; response means unauthenticated' if no duplicate found
  if (!foundAdmin) return res.sendStatus(401)

  // evaluate password using bcrypt to compare the hashed password in the database with the password received via the request
  const match = await bcrypt.compare(adminPassword, foundAdmin.password)

  // handle password match senerio
  if (match) {
    // create jwt accessToken
    const accessToken = createJwtAccessToken(foundAdmin.username)

    // create jwt refreshToken
    const refreshToken = createJwtRefreshToken(foundAdmin.username)

    // Purpose: save refreshToken with the current admin. This will allow for the creation of a logout route that will invalidate the refreshToken when an admin logs out.  RefreshToken with the current admin in a database that can be cross referenced when it is sent back to create another access token.

    // create an array of the other users in the database that are not the user logged in
    const otherAdmin = adminDB.admins.filter(admin => admin.username !== foundAdmin.username)

    // create currentAdmin object with the foundAdmin and their refreshToken
    const currentAdmin = { ...foundAdmin, refreshToken }

    // pass in the other users along with the logged in user to setAdmins
    adminDB.setAdmins([...otherAdmin, currentAdmin])

    // write the current user to the database
    await fsPromises.writeFile(
      // navigate from the current directory up and into the model directory, to users.json
      path.join(__dirname, '..', 'model', 'administrators.json'),

      // specify the data to be written
      JSON.stringify(adminDB.admins)
    )

    // Purpose: send refreshToken in a cookie with httpOnly set to true, prohibiting access from Js this method is more secure than storing refreshToken in local storage or another cookie that is available to Js. NOTE: maxAge is set to 1 day via milliseconds
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    // accesstoken is sent as json, that the FED can use to authenticate the user. FED needs to store this in memory.
    res.json({ accessToken })
  } else {
    // send status 401: 'unauthorized; response means unauthenticated' if password mismatch
    res.sendStatus(401)
  }
}

export default handleAdminAuthentication
