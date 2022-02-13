import type { Request, Response } from 'express'
import fsPromises from 'fs/promises'
import bcrypt from 'bcrypt'
import administrators from '../model/administrators.json'
import path from 'path'

// modeled after useState in react with administrators & setAdministrators
const adminDB = {
  admins: administrators,
  setAdmins: function (data: any) {
    this.admins = data
  }
}

const handleNewAdminRegistration = async (req: Request, res: Response) => {
  // destructure the request body
  const { username, password, email } = req.body

  // check for missing username or password and send status 400 if true: 'server could not understand the request due to invalid syntax'
  if (!username || !password || !email)
    return res.status(400).json({ message: 'Username, password and email are required.' })

  // check for duplicate usernames in the db
  const duplicate = administrators.find((admin: any) => admin.username === username)

  // send status 409: 'request conflict - username is already taken'
  if (duplicate) return res.sendStatus(409)

  // create a new administrator
  try {
    // encrypt the password received via ten salt rounds
    const hashedPwd = await bcrypt.hash(password, 10)

    // increment the id based on the id of the last user in the db, if true
    const userId = adminDB.admins.length > 0 ? adminDB.admins[adminDB.admins.length - 1].id + 1 : 1

    //store the new user with the hased passsword
    const newUser = { id: userId, username: username, password: hashedPwd, email: email }

    // pass in the new user to the database using the custom setUsers method
    adminDB.setAdmins([...adminDB.admins, newUser])

    // write the new user to the database
    await fsPromises.writeFile(
      // navigate from the current directory up and into the model directory, to users.json
      path.join(__dirname, '..', 'model', 'administrators.json'),
      // specify the data to be written
      JSON.stringify(adminDB.admins)
    )

    // console.log(usersDB.users)

    // send status 201: 'request succeeded, and a new resource was created as a result'
    res.status(201).json({ success: `${username} has been created.` })
  } catch (err) {
    // send status 500: 'server has encountered a situation it does not know how to handle'
    res.status(500).json({ message: err })
  }
}

export default handleNewAdminRegistration
