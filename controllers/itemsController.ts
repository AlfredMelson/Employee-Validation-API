const data = {
  employees: require('../model/employees.json'),
  setEmployees: function (data) {
    this.employees = data
  }
}

let items = []

const updateItem = item => {
  items.push(item)
}

export const getItems = () => {
  return data.employees.map(userItem => {
    const updatedItem = items.find(({ id }) => id === userItem.id)

    return {
      ...(updatedItem || userItem)
    }
  })
}
module.exports = {
  updateItem,
  getItems
}
