import { Request, Response } from 'express'
import path from 'path'
// modeled after useState in react with users & setUsers
const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data
  }
}
const fsPromises = require('fs').promises
const bcrypt = require('bcrypt')

const handleNewUserRegistration = async (req: Request, res: Response) => {
  // destructure the request body
  const { user, pwd, email } = req.body

  // check for missing username or password and send status 400 if true: 'server could not understand the request due to invalid syntax'
  if (!user || !pwd || !email)
    return res.status(400).json({ message: 'Username, password and email are required.' })

  // check for duplicate usernames in the db
  const duplicate = usersDB.users.find(person => person.username === user)

  // send status 409: 'request conflict - username is already taken'
  if (duplicate) return res.sendStatus(409)

  // create a new user
  try {
    // encrypt the password received via ten salt rounds
    const hashedPwd = await bcrypt.hash(pwd, 10)

    //store the new user with the hased passsword
    const newUser = { username: user, password: hashedPwd, email: email }

    // pass in the new user to the database using the custom setUsers method
    usersDB.setUsers([...usersDB.users, newUser])

    // write the new user to the database
    await fsPromises.writeFile(
      // navigate from the current directory up and into the model directory, to users.json
      path.join(__dirname, '..', 'model', 'users.json'),
      // specify the data to be written
      JSON.stringify(usersDB.users)
    )

    // console.log(usersDB.users)

    // send status 201: 'request succeeded, and a new resource was created as a result'
    res.status(201).json({ success: `${user} has been created.` })
  } catch (err) {
    // send status 500: 'server has encountered a situation it does not know how to handle'
    res.status(500).json({ message: err.message })
  }
}
// placed in an object so that the full name can be pulled in when imported
module.exports = { handleNewUserRegistration }
