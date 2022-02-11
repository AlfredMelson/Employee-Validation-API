import { Response, NextFunction } from 'express'
const path = require('path')
const employees = require('../model/employeeList')
const fsPromises = require('fs').promises

export const employeeInitialization = async (res: Response, next: NextFunction) => {
  // check contents of employees.json file
  const employeesJson = await JSON.parse(fsPromises.readFileSync('../model/employees.json'))

  // initialize employees.json file to set email creation dates if no entries exist
  if (Object.entries(employeesJson).length !== 0) {
    try {
      // write employees to the json file
      await fsPromises.writeFile(
        // navigate from the current directory up and into the model directory, to users.json
        path.join(__dirname, '..', 'model', 'employees.json'),

        // specify the data to be written
        employees.map(e => {
          JSON.stringify(e)
        })
        // JSON.stringify(employees)
      )
      res.status(201).json({ success: 'All employees have been created.' })
    } catch (err) {
      // send status 500: 'server has encountered a situation it does not know how to handle'
      res.status(500).json({ message: err.message })
    }
  }
  next()
}

module.exports = employeeInitialization
