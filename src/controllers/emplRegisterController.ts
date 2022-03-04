import type { Request, Response } from 'express'
import fsPromises from 'fs/promises'
import path from 'path'
import employees from '../model/employees.json'
import { Empl } from './../model/employees'

const emplDB = {
  empls: employees,
  setEmpls: function (data: Empl[]) {
    this.empls = data
  }
}

const handleEmplRegistration = async (req: Request, res: Response) => {
  // destructure the request body
  const { emplFirstname, emplLastname, emplRole, emplEmail } = req.body

  // check for duplicate usernames in the db
  const duplicateFirstname = emplDB.empls.find(empl => empl.firstname === emplFirstname)
  const duplicateLastname = emplDB.empls.find(empl => empl.lastname === emplLastname)

  const duplicateName = duplicateFirstname || duplicateLastname

  // check for duplicate email in the db
  const duplicateEmail = emplDB.empls.find(empl => empl.email === emplEmail)

  // send status 409: 'request conflict - username is already taken'
  if (duplicateName || duplicateEmail) return res.sendStatus(409)

  // create a new employee
  try {
    // determine the length of emplDB
    const emplDBLength: number = Math.floor(emplDB.empls.length)
    // increment the id based on the id of the last empl in the db
    const emplId = JSON.stringify(emplDBLength > 0 ? emplDBLength + 1 : 1)

    // generate a creation date
    const creationDate = new Date().toISOString()

    // create a new employee object
    const newEmpl = {
      id: emplId,
      firstname: emplFirstname,
      lastname: emplLastname,
      role: emplRole,
      email: emplEmail,
      createdAt: creationDate
    }

    // pass in the new empl to the database using the custom setEmpls method
    emplDB.setEmpls([...emplDB.empls, newEmpl])

    // write the new empl to the database
    await fsPromises.writeFile(
      // navigate from the current directory up and into the model directory, to employees.json
      path.join(__dirname, '..', 'model', 'employees.json'),
      // specify the data to be written
      JSON.stringify(emplDB.empls)
    )

    // send status 201: 'request succeeded, and a new resource was created as a result'
    res.status(201).json({ success: `${emplFirstname} ${emplLastname} has been created.` })
  } catch (err) {
    // send status 500: 'server has encountered a situation it does not know how to handle'
    res.status(500).json({ message: err })
  }
}

export default handleEmplRegistration
