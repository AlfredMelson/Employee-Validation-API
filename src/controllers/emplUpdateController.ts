import type { Request, Response } from 'express'
import fsPromises from 'fs/promises'
import path from 'path'
import employees from '../model/employees.json'

// modeled after useState in react with users & setUsers
const emplDB = {
  empls: employees,
  setEmpls: function (data: any) {
    this.empls = data
  }
}

const handleEmployeeUpdate = async (req: Request, res: Response) => {
  // destructure the request body
  const { emplId, emplName, emplRole, emplEmail } = req.body

  // check for empl(email) exists in the database
  const foundEmpl = emplDB.empls.find((empl: any) => empl.email === emplEmail)

  // send status 401: 'unauthorized; response means unauthenticated' if no duplicate found
  if (!foundEmpl) return res.sendStatus(401)

  // create a new employee
  try {
    // create an array of the other users in the database that are not the user logged in
    const otherEmpls = emplDB.empls.filter((empl: any) => empl.email !== emplEmail)

    // generate a new Date().toISOString()
    const updatedDate = new Date().toISOString()

    // store the new empl with the hased passsword
    const updatedEmpl = {
      id: emplId,
      name: emplName,
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
    res.status(201).json({ success: `${emplName} has been updated.` })
  } catch (err) {
    // send status 500: 'server has encountered a situation it does not know how to handle'
    res.status(500).json({ message: err })
  }
}

export default handleEmployeeUpdate
