import { Request, Response } from 'express'
// modeled after useState in react with users & setUsers
const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data
  }
}
const fsPromises = require('fs').promises
import path from 'path'

const handleUserLogout = async (req: Request, res: Response) => {
  // NOTE for FED: delete the accessToken in clientside memory

  // set cookies to the request cookies
  const cookies = req.cookies

  // check that there are no cookies or (optionally chaining) for a jwt property and send status 204 if true: 'no content to send for this request'
  if (!cookies?.jwt) return res.sendStatus(204)

  // define the refreshToken and set it equal to value received
  const refreshToken = cookies.jwt

  // check for user(username) exists in the database with a refreshToken
  const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)

  // if no foundUser proceed with clearing the cookie
  if (!foundUser) {
    // NOTE: options for clearing the cookie must be the same as those used during set
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

    // return and send status 204 successful but 'no content to send for this request'
    return res.sendStatus(204)
  }

  // At this point, the same refreshToken was found in the db, so proceed with deletion.

  // check for user(username) exists in the database with a refreshToken
  const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken)

  // create currentUser object with the foundUser and refreshToken set to ''
  const currentUser = { ...foundUser, refreshToken: '' }

  // pass in the other users along with the current user (just defined) to the setUser array
  usersDB.setUsers([...otherUsers, currentUser])

  // write the current user to the file (database)
  await fsPromises.writeFile(
    // navigate from the current directory up and into the model directory, to users.json
    path.join(__dirname, '..', 'model', 'users.json'),

    // specify the data to be written
    JSON.stringify(usersDB.users)
  )

  // delete cookie
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

  // return and send status 204 successful but 'no content to send for this request'
  res.sendStatus(204)
}

module.exports = { handleUserLogout }
