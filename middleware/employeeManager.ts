const employees = require('../model/employees')

let items = []

const employeeManager = () => {
  return employees.map(userItem => {
    const updatedItem = items.find(({ id }) => id === userItem.id)

    return {
      ...(updatedItem || userItem)
    }
  })
}

module.exports = employeeManager
