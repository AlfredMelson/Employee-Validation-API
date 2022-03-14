import type { Request, Response } from 'express'
import fsPromises from 'fs/promises'
import administrators from '../model/administrators.json'
import path from 'path'

const adminDB = {
  admins: administrators,
  setAdmins: function (data: any) {
    this.admins = data
  }
}

const handleAdminLogout = async (req: Request, res: Response) => {
  // NOTE: FED needs to delete the accessToken in clientside memory

  console.log('adminLogoutController - req', req)

  // define cookies and grab it if it exists
  const cookies = req?.cookies
  console.log('adminLogoutController - cookies', cookies)

  // check that there are no cookies or (optionally chaining) for a jwt property and send status 204 if true: 'no content to send for this request'
  if (!cookies.jwt) return res.sendStatus(204)

  // define the refreshToken and set it equal to value received
  const refreshToken = cookies.jwt

  console.log('adminLogoutController - refreshToken', refreshToken)

  // check if admin (username) exists in the database with a refreshToken
  const foundAdmin = adminDB.admins.find(admin => admin.refreshToken === refreshToken)
  console.log('adminLogoutController - foundAdmin', foundAdmin)

  // if no foundAdmin proceed with clearing the cookie
  if (!foundAdmin) {
    // NOTE: options for clearing the cookie must be the same as those used during set
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

    // return and send status 204 successful but 'no content to send for this request'
    return res.sendStatus(204)
  }

  // At this point, the same refreshToken was found in the db, so proceed with deletion.

  // filter out found admin(id) to define otherAdmins
  const otherAdmin = adminDB.admins.filter(admin => admin.id !== foundAdmin.id)

  // create currentAdmin object with the foundAdmin and refreshToken set to ''
  const loggedOutAdmin = {
    id: foundAdmin.id,
    username: foundAdmin.username,
    password: foundAdmin.password,
    email: foundAdmin.email,
    refreshToken: []
  }

  // check the number of admin in the database
  if (Object.keys(otherAdmin).length === 1) {
    // pass in the current admin as the sole admin to setAdmins
    adminDB.setAdmins([loggedOutAdmin])
  } else {
    // pass in the other admins along with the current admin to setAdmins
    adminDB.setAdmins([...otherAdmin, loggedOutAdmin])
  }

  // write the current user to the database
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
