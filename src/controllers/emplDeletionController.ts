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

const handleEmplDeletion = async (req: Request, res: Response) => {
  // destructure the request body
  const { emplFirstname, emplLastname, emplEmail } = req.body

  // check for empl(email) exists in the database
  const foundEmpl = emplDB.empls.find((empl: any) => empl.email === emplEmail)

  // send status 401: 'unauthorized; response means unauthenticated' if no duplicate found
  if (!foundEmpl) return res.sendStatus(401)

  // write employee list without found employee
  try {
    // create an array of the other empls that are not the current empl
    const otherEmpls = emplDB.empls.filter((empl: any) => empl.email !== emplEmail)

    // pass in other employees to setEmpls without the deleted employee
    emplDB.setEmpls([...otherEmpls])

    // write the new empl to the database
    await fsPromises.writeFile(
      // navigate from the current directory up and into the model directory, to employees.json
      path.join(__dirname, '..', 'model', 'employees.json'),
      // specify the data to be written
      JSON.stringify(emplDB.empls)
    )

    // send status 201: 'request succeeded, and a new resource was updated as a result'
    res.status(201).json({ success: `${emplFirstname} ${emplLastname} has been deleted.` })
  } catch (err) {
    // send status 500: 'server has encountered a situation it does not know how to handle'
    res.status(500).json({ message: err })
  }
}

export default handleEmplDeletion
