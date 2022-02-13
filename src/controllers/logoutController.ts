import type { Request, Response } from 'express'
import { administrators } from '../model/administrators'
import { removeRefreshToken } from '../services/tokenManager'

// modeled after useState in react with administrators & setAdministrators

const handleAdminLogout = async (req: Request, res: Response) => {
  // NOTE: FED needs to delete the accessToken in clientside memory

  // set cookies to the request cookies
  const cookies = req.cookies

  // check that there are no cookies or (optionally chaining) for a jwt property and send status 204 if true: 'no content to send for this request'
  if (!cookies?.jwt) return res.sendStatus(204)

  // define the refreshToken and set it equal to value received
  const refreshToken = cookies.jwt

  // check for admin(username) exists in the database with a refreshToken
  const foundAdmin = administrators.find(admin => admin.refreshToken === refreshToken)

  // if no foundAdmin proceed with clearing the cookie
  if (!foundAdmin) {
    // NOTE: options for clearing the cookie must be the same as those used during set
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

    // return and send status 204 successful but 'no content to send for this request'
    return res.sendStatus(204)
  }

  // At this point, the same refreshToken was found in the db, so proceed with deletion.

  // check for admin(username) exists in the database with a refreshToken
  // const otherAdmins = administrators.filter(
  //   admin => admin.refreshToken !== foundAdmin.refreshToken
  // )

  // create currentAdmin object with the foundAdmin and refreshToken set to ''
  // const currentAdmin = { ...foundAdmin, refreshToken: '' }

  const wipedRefreshToken = ''
  removeRefreshToken(wipedRefreshToken, foundAdmin.id)

  // pass in the other admins along with the current admin (just defined) to setAdministrators
  // setAdministrators([...otherAdmins, currentAdmin])

  // write the current user to the file (database)
  // writeFile(
  //   path.join(__dirname, '..', 'model', 'administrators.json'),
  //   JSON.stringify(administrators),
  //   err => {
  //     if (err) throw err
  //     console.log('The file has been saved.')
  //   }
  // )

  // delete cookie
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

  // return and send status 204 successful but 'no content to send for this request'
  res.sendStatus(204)
}

export default handleAdminLogout
