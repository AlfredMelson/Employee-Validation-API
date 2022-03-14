import employees from '../model/employees.json'
import type { Request, Response } from 'express'
import { Empl } from '../model/employees'
import { v4 as uuidv4 } from 'uuid'

const emplDB = {
  empls: employees,
  setEmpls: function (data: Empl[]) {
    this.empls = data
  }
}

export const getAllEmployees = (_req: Request, res: Response) => {
  console.log('employeesController: getAllEmployees request')

  res.json(emplDB.empls)
}

export const createNewEmployee = (req: Request, res: Response) => {
  // generate a creation date
  const creationDate = new Date().toISOString()

  // create a new uuid for the new employee
  const emplId = uuidv4()

  const newEmployee = {
    id: emplId,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    role: req.body.role,
    email: req.body.email,
    createdAt: creationDate
  }

  if (!newEmployee.firstname || !newEmployee.lastname || !newEmployee.role || !newEmployee.email) {
    return res.status(400).json({ message: 'Required data was not received.' })
  }

  emplDB.setEmpls([...emplDB.empls, newEmployee])

  // status of 201: request was successful, resource was created
  res.status(201).json(emplDB.empls)
}

export const updateEmployee = (req: Request, res: Response) => {
  const employee = emplDB.empls.find(empl => empl.id === req.body.id)
  if (!employee) {
    return res.status(400).json({ message: `Employee ID ${req.body.id} not found` })
  }
  if (req.body.firstname) employee.firstname = req.body.firstname
  if (req.body.lastname) employee.lastname = req.body.lastname
  const filteredArray = emplDB.empls.filter(empl => empl.id !== req.body.id)
  const unsortedArray = [...filteredArray, employee]
  emplDB.setEmpls(unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0)))
  res.json(emplDB.empls)
}

export const deleteEmployee = (req: Request, res: Response) => {
  const employee = emplDB.empls.find(empl => empl.id === req.body.id)
  if (!employee) {
    return res.status(400).json({ message: `Employee ID ${req.body.id} not found` })
  }
  const filteredArray = emplDB.empls.filter(empl => empl.id !== req.body.id)
  emplDB.setEmpls([...filteredArray])
  res.json(emplDB.empls)
}

export const getEmployee = (req: Request, res: Response) => {
  const employee = emplDB.empls.find(empl => empl.id === req.params.id)
  if (!employee) {
    return res.status(400).json({ message: `Employee ID ${req.params.id} not found` })
  }
  res.json(employee)
}
