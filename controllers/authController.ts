import { Request, Response } from 'express'
import path from 'path'
// modeled after useState in react with users & setUsers
const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data
  }
}
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fsPromises = require('fs').promises

const handleUserAuthentication = async (req: Request, res: Response) => {
  // destructure the request body
  const { user, pwd } = req.body

  // check for missing username or password and send status 400 if true: 'server could not understand the request due to invalid syntax'
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' })

  // check for user(username) exists in the database
  const foundUser = usersDB.users.find(person => person.username === user)

  // send status 401: 'unauthorized; response means unauthenticated' if no duplicate found
  if (!foundUser) return res.sendStatus(401)

  // evaluate password using bcrypt to compare the hashed password in the database with the password received via the request
  const match = await bcrypt.compare(pwd, foundUser.password)

  // handle password match senerio
  if (match) {
    // jsonwebtokens
    // create jwt accessToken
    const accessToken = jwt.sign(
      // first: payload will be the foundUser username object
      { username: foundUser.username },

      // second: access secret defined in .env
      process.env.ACCESS_TOKEN_SECRET,

      // third: options value for expiration (Production ~10 mins)
      { expiresIn: '10m' }
    )
    // create jwt refreshToken
    const refreshToken = jwt.sign(
      // first: payload will be the foundUser username object
      { username: foundUser.username },

      // second: refresh secret defined in .env
      process.env.REFRESH_TOKEN_SECRET,

      // third: options value for expiration
      { expiresIn: '1d' }
    )

    // Purpose: save refreshToken with the current user. This will allow for the creation of a logout route that will invalidate the refreshToken when a user logs out.  RefreshToken with the current user in a database that can be cross referenced when it is sent back to create another access token.

    // create an array of the other users in the database that are not the user logged in
    const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)

    // create currentUser object with the foundUser and their refreshToken
    const currentUser = { ...foundUser, refreshToken }

    // pass in the other users along with the logged in user to the setUser array
    usersDB.setUsers([...otherUsers, currentUser])

    // write the current user to the database
    await fsPromises.writeFile(
      // navigate from the current directory up and into the model directory, to users.json
      path.join(__dirname, '..', 'model', 'users.json'),

      // specify the data to be written
      JSON.stringify(usersDB.users)
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

module.exports = { handleUserAuthentication }
