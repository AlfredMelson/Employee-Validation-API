import type { Request, Response } from 'express'
import employees from '../model/employees.json'

const handleGetAllEmpl = async (req: Request, res: Response) => {
  try {
    // respond with all employees
    res.json(employees)
  } catch (err) {
    // send status 500: 'server has encountered a situation it does not know how to handle'
    res.status(500).json({ message: err })
  }
}

export default handleGetAllEmpl
