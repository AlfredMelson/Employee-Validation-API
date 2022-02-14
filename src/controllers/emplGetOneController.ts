import type { Request, Response } from 'express'
import employees from '../model/employees.json'

// modeled after useState in react with users & setUsers
const emplDB = {
  empls: employees,
  setEmpls: function (data: any) {
    this.empls = data
  }
}

const handleGetEmpl = async (req: Request, res: Response) => {
  // destructure the request body
  const { emplId } = req.body

  // check for empl(email) exists in the database
  const foundEmpl = emplDB.empls.find(empl => empl.id === emplId)

  // send status 401: 'unauthorized; response means unauthenticated' if no duplicate found
  if (!foundEmpl) return res.sendStatus(401)
  res.json(foundEmpl)
}

export default handleGetEmpl
