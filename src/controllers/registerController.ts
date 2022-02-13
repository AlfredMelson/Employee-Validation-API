import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { administrators } from '../model/administrators'

const handleNewAdminRegistration = async (req: Request, res: Response) => {
  // destructure the request body
  const { username, password, email } = req.body

  // check for missing username or password and send status 400 if true: 'server could not understand the request due to invalid syntax'
  if (!username || !password || !email)
    return res.status(400).json({ message: 'Username, password and email are required.' })

  // check for duplicate usernames in the db
  const duplicate = administrators.find(admin => admin.username === username)

  // send status 409: 'request conflict - username is already taken'
  if (duplicate) return res.sendStatus(409)

  // create a new administrator
  try {
    // encrypt the password received via ten salt rounds
    const hashedPwd = await bcrypt.hash(password, 10)

    // increment the id based on the id of the last user in the db, if true
    const adminId = administrators.length > 0 ? administrators[administrators.length - 1].id + 1 : 1

    //store the new administrator with the hased passsword
    // const newAdmin = {
    //   id: adminId,
    //   username: username,
    //   password: hashedPwd,
    //   email: email,
    //   refreshToken: ''
    // }
    const newAdmin = { id: adminId, username, password: hashedPwd, email, refreshToken: '' }

    // add new admin to the administrators array
    administrators.push(newAdmin)

    // send status 201: 'request succeeded, and a new resource was created as a result'
    res.status(201).json({ success: `${username} has been created.` })
  } catch (err) {
    // send status 500: 'server has encountered a situation it does not know how to handle'
    res.status(500).json({ message: err })
  }
}
export default handleNewAdminRegistration
