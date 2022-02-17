import type { Request, Response } from 'express'
import fsPromises from 'fs/promises'
import administrators from '../model/administrators.json'
import path from 'path'

// modeled after useState in react with admins & setAdmins
const adminDB = {
  admins: administrators,
  setAdmins: function (data: any) {
    this.admins = data
  }
}

const handleAdminLogout = async (req: Request, res: Response) => {
  // NOTE: FED needs to delete the accessToken in clientside memory

  // set cookies to the request cookies
  const cookies = req.cookies

  // check that there are no cookies or (optionally chaining) for a jwt property and send status 204 if true: 'no content to send for this request'
  if (!cookies?.jwt) return res.sendStatus(204)

  // define the refreshToken and set it equal to value received
  const refreshToken = cookies.jwt

  // check for admin (username) exists in the database with a refreshToken
  const foundAdmin = adminDB.admins.find(admin => admin.refreshToken === refreshToken)

  // if no foundAdmin proceed with clearing the cookie
  if (!foundAdmin) {
    // NOTE: options for clearing the cookie must be the same as those used during set
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

    // return and send status 204 successful but 'no content to send for this request'
    return res.sendStatus(204)
  }

  // At this point, the same refreshToken was found in the db, so proceed with deletion.

  // check for admin (username) exists in the database with a refreshToken
  const otherAdmins = adminDB.admins.filter(
    person => person.refreshToken !== foundAdmin.refreshToken
  )

  // create currentAdmin object with the foundAdmin and refreshToken set to ''
  const currentAdmin = { ...foundAdmin, refreshToken: '' }

  // pass in the other admins along with the current admin to setAdmins
  adminDB.setAdmins([...otherAdmins, currentAdmin])

  // write the current admin to the file (database)
  await fsPromises.writeFile(
    // navigate from the current directory up and into the model directory, to administrators.json
    path.join(__dirname, '..', 'model', 'administrators.json'),

    // specify the data to be written
    JSON.stringify(adminDB.admins)
  )

  // delete cookie
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

  // return and send status 204 successful but 'no content to send for this request'
  res.sendStatus(204)
}

export default handleAdminLogout
