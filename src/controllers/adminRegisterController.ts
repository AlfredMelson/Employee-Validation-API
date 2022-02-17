import type { Request, Response } from 'express'
import fsPromises from 'fs/promises'
import bcrypt from 'bcrypt'
import administrators from '../model/administrators.json'
import path from 'path'

// modeled after useState in react with admins & setAdmins
const adminDB = {
  admins: administrators,
  setAdmins: function (data: any) {
    this.admins = data
  }
}

const handleAdminRegistration = async (req: Request, res: Response) => {
  // destructure the request body
  const { adminUsername, adminPassword, adminEmail } = req.body

  // check for duplicate usernames in the admin database
  const duplicateUsername = administrators.find((admin: any) => admin.username === adminUsername)

  // check for duplicate email in the db
  const duplicateEmail = administrators.find((admin: any) => admin.email === adminEmail)

  // send status 409: 'request conflict - username is already taken'
  if (duplicateUsername || duplicateEmail) return res.sendStatus(409)

  // create a new administrator
  try {
    // encrypt the password received via ten salt rounds
    const hashedPwd = await bcrypt.hash(adminPassword, 10)

    // increment the id based on the id of the last admin in the db, if true
    const userId = adminDB.admins.length > 0 ? adminDB.admins[adminDB.admins.length - 1].id + 1 : 1

    //store the new admin with the hased passsword
    const newAdmin = { id: userId, username: adminUsername, password: hashedPwd, email: adminEmail }

    // pass in the new admin to the database using the custom setAdmins method
    adminDB.setAdmins([...adminDB.admins, newAdmin])

    // write the new admin to the database
    await fsPromises.writeFile(
      // navigate from the current directory up and into the model directory, to administrators.json
      path.join(__dirname, '..', 'model', 'administrators.json'),
      // specify the data to be written
      JSON.stringify(adminDB.admins)
    )

    // send status 201: 'request succeeded, and a new resource was created as a result'
    res.status(201).json({ success: `${adminUsername} has been created.` })
  } catch (err) {
    // send status 500: 'server has encountered a situation it does not know how to handle'
    res.status(500).json({ message: err })
  }
}

export default handleAdminRegistration
