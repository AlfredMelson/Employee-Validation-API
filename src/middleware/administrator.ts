import { employees } from '../model/employees'

const items: any[] = []

const administrator = () => {
  return employees.map((userItem: { id: any }) => {
    const updatedItem = items.find(({ id }) => id === userItem.id)

    return {
      ...(updatedItem || userItem)
    }
  })
}

export default administrator
