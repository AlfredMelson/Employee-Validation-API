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

export const createNewEmployee = (req: Request, res: Response) => {
  const newEmployee = {
    id: (data.employees?.length
      ? parseInt(data.employees[data.employees.length - 1].id + 1)
      : 1
    ).toString(),
    name: req.body.name,
    role: req.body.role,
    email: req.body.email,
    createdAt: new Date().toISOString()
  }

  if (!newEmployee.name || !newEmployee.role || !newEmployee.email) {
    return res.status(400).json({ message: 'Name, role and email are required.' })
  }

  data.setEmployees([...data.employees, newEmployee])
  res.status(201).json(data.employees)
}

export const updateEmployee = (req: Request, res: Response) => {
  const employee = data.employees.find(emp => emp.id === req.body.id)
  if (!employee) {
    return res.status(400).json({ message: `Employee ID ${req.body.id} not found` })
  }
  if (req.body.id) employee.id = req.body.id
  if (req.body.name) employee.name = req.body.name
  if (req.body.role) employee.role = req.body.role
  if (req.body.email) employee.email = req.body.email
  if (req.body.createdAt) employee.createdAt = req.body.createdAt
  const filteredArray = data.employees.filter(emp => emp.id !== req.body.id)
  const unsortedArray = [...filteredArray, employee]
  data.setEmployees(unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0)))
  res.json(data.employees)
}

export const deleteEmployee = (req: Request, res: Response) => {
  const employee = data.employees.find(emp => emp.id === req.body.id)
  if (!employee) {
    return res.status(400).json({ message: `Employee ID ${req.body.id} not found` })
  }
  const filteredArray = data.employees.filter(emp => emp.id !== req.body.id)

  data.setEmployees([...filteredArray])
  res.json(data.employees)
}

export const getEmployee = (req: Request, res: Response) => {
  const employee = data.employees.find(emp => emp.id === req.params.id)
  if (!employee) {
    return res.status(400).json({ message: `Employee ID ${req.params.id} not found` })
  }
  res.json(employee)
}
