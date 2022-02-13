import type { Request, Response } from 'express'
const data = {
  employees: require('../model/employees'),
  setEmployees: function (data: any) {
    this.employees = data
  }
}

// FIXME: This is a temporary solution to get the data from the database.
export const getAllItems = (res: Response) => {
  res.json(data.employees)
}

// FIXME: This is a temporary solution to get the data from the database.
// export const updateItem = item => {
//   if (items.some(i => i.id === item.id)) {
//     items[items.indexOf(items.find(i => i.id === item.id))] = item
//   } else {
//     items.push(item)
//   }
// }

export const updateItem = (req: Request, res: Response) => {
  const item = data.employees.find((emp: { id: number }) => emp.id === parseInt(req.body.id))
  if (!item) {
    return res.status(400).json({ message: `Employee ID ${req.body.id} not found` })
  }
  if (req.body.firstname) item.firstname = req.body.firstname
  if (req.body.lastname) item.lastname = req.body.lastname
  if (req.body.email) item.email = req.body.email
  const filteredArray = data.employees.filter(
    (emp: { id: number }) => emp.id !== parseInt(req.body.id)
  )
  const unsortedArray = [...filteredArray, item]
  data.setEmployees(unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0)))
  res.json(data.employees)
}

// FIXME: This is a temporary solution to get the data from the database.
// export const getItems = () => {
//   return data.employees.map(userItem => {
//     const updatedItem = data.employees.find(({ id }) => id === userItem.id)

//     return {
//       ...(updatedItem || userItem)
//     }
//   })
// }

// FIXME: This is a temporary solution to get the data from the database.
// export const deleteItem = (req: Request, res: Response) => {
//   const employee = data.employees.find(emp => emp.id === parseInt(req.body.id))
//   if (!employee) {
//     return res.status(400).json({ message: `Employee ID ${req.body.id} not found` })
//   }
//   const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id))
//   data.setEmployees([...filteredArray])
//   res.json(data.employees)
// }

// FIXME: This is a temporary solution to get the data from the database.
// export const getItem = (req: Request, res: Response) => {
//   const employee = data.employees.find(emp => emp.id === parseInt(req.params.id))
//   if (!employee) {
//     return res.status(400).json({ message: `Employee ID ${req.params.id} not found` })
//   }
//   res.json(employee)
// }
