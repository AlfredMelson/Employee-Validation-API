import { employees } from '../model/employees'

const items: any[] = []

const employeeManager = () => {
  return employees.map((userItem: { id: any }) => {
    const updatedItem = items.find(({ id }) => id === userItem.id)

    return {
      ...(updatedItem || userItem)
    }
  })
}

export default employeeManager
