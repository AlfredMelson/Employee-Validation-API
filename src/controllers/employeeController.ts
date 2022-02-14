import type { Request, Response } from 'express'
import employeesData from '../model/employees.json'

// modeled after useState in react with users & setUsers
const data = {
  employees: employeesData,
  setEmployees: function (data: any) {
    this.employees = data
  }
}

export const getAllEmployees = (res: Response) => {
  res.json(data.employees)
}

export const getEmployee = (req: Request, res: Response) => {
  const employee = data.employees.find(emp => emp.id === req.params.id)
  if (!employee) {
    return res.status(400).json({ message: `Employee ID ${req.params.id} not found` })
  }
  res.json(employee)
}
