import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { createJwtAccessToken, createJwtRefreshToken } from '../services/tokenManager'
import { administrators } from '../model/administrators'

// modeled after useState in react with administrators & setAdministrators
// const adminDB = {
//   administrators: administrators,
//   setAdministrators: function (data: any) {
//     this.administrators = data
//   }
// }

export interface IUpdateAdministrator {
  id: number
  username: string
  email: string
  password: string
  refreshToken?: string
}
const updateAdministrator: Array<IUpdateAdministrator> = []

const handleAdminAuthentication = async (req: Request, res: Response) => {
  // destructure the request body
  const { username, password } = req.body

  // check for missing username or password and send status 400 if true: 'server could not understand the request due to invalid syntax'
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password are required.' })

  // check for admin(username) exists in the database
  const foundAdmin = administrators.find(admin => admin.username === username)

  // send status 401: 'unauthorized; response means unauthenticated' if no duplicate found
  if (!foundAdmin) return res.sendStatus(401)

  // evaluate password using bcrypt to compare the hashed password in the database with the password received via the request
  const match = await bcrypt.compare(password, foundAdmin.password)

  // handle password match senerio
  if (match) {
    // create jwt accessToken
    const accessToken = createJwtAccessToken(foundAdmin.username)

    // create jwt refreshToken
    const refreshToken = createJwtRefreshToken(foundAdmin.username)

    // Purpose: save refreshToken with the current admin. This will allow for the creation of a logout route that will invalidate the refreshToken when a admin logs out.  RefreshToken with the current admin in a database that can be cross referenced when it is sent back to create another access token.

    // update a users property using push
    updateAdministrator.push({
      id: foundAdmin.id,
      username: foundAdmin.username,
      email: foundAdmin.email,
      password: foundAdmin.password,
      refreshToken: refreshToken
    })

    administrators[1].refreshToken = refreshToken

    // update the the foundAdmin with the refreshToken
    // const updateAdmin = (foundAdmin.refreshToken = refreshToken)
    // const updateAdmin = updateAdministrator.push({ ...foundAdmin, refreshToken })
    // console.log(updateAdmin)

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
