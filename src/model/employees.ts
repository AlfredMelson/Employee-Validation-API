enum Roles {
  read = 'read',
  write = 'write',
  admin = 'admin'
}
interface IEmployee {
  id: string
  name: string
  role: Roles
  email: string
  createdAt: string
}

export const employees: IEmployee[] = [
  {
    id: '1',
    name: 'Jonas Jonaitis',
    role: Roles.admin,
    email: 'email123',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Petras Petraitis',
    role: Roles.read,
    email: 'test@test.com',
    createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString()
  },
  {
    id: '3',
    name: 'Povilas Povilaitis',
    role: Roles.read,
    email: 'email123',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Juozas Juozaitis',
    role: Roles.admin,
    email: 'test@gmail.com',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Tomas Tomaitis',
    role: Roles.admin,
    email: 'Vardenis2000@gmail.com',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Giedrius Giedraitis',
    role: Roles.write,
    email: 'Vardenis2@gmail.com',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Justas Justaitis',
    role: Roles.admin,
    email: 'email@gmail.com',
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Laurynas Laurinaitis',
    role: Roles.admin,
    email: 'pavardenis321@gmail.com',
    createdAt: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Gerda Gerdaitė',
    role: Roles.write,
    email: 'discordemail123@gmail.com.',
    createdAt: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Kristina Kristinaitė',
    role: Roles.read,
    email: 'pass1',
    createdAt: new Date().toISOString()
  }
]
