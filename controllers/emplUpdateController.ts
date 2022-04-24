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

const handleEmployeeUpdate = async (req: Request, res: Response) => {
  // destructure the request body
  const { emplId, emplFirstname, emplLastname, emplRole, emplEmail } = req.body

  // check for empl(email) exists in the database
  const foundEmpl = emplDB.empls.find(empl => empl.id === emplId)

  // send status 401: 'unauthorized; response means unauthenticated' if no duplicate found
  if (!foundEmpl) return res.sendStatus(401)

  // create a new employee
  try {
    // create an array of the other empls in the database that are not the current empl
    const otherEmpls = emplDB.empls.filter(empl => empl.id !== emplId)

    // generate a new Date().toISOString()
    const updatedDate = new Date().toISOString()

    // store the new empl with the updated email address
    const updatedEmpl = {
      id: emplId,
      firstname: emplFirstname,
      lastname: emplLastname,
      role: emplRole,
      email: emplEmail,
      createdAt: updatedDate
    }

    // pass in the updated empl to the database using the custom setEmpls method
    emplDB.setEmpls([...otherEmpls, updatedEmpl])

    // write the new empl to the database
    await fsPromises.writeFile(
      // navigate from the current directory up and into the model directory, to employees.json
      path.join(__dirname, '..', 'model', 'employees.json'),
      // specify the data to be written
      JSON.stringify(emplDB.empls)
    )

    // send status 201: 'request succeeded, and a new resource was updated as a result'
    res.status(201).json({ success: `${emplFirstname} ${emplLastname} has been updated.` })
  } catch (err) {
    // send status 500: 'server has encountered a situation it does not know how to handle'
    res.status(500).json({ message: err })
  }
}

export default handleEmployeeUpdate
