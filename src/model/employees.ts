enum Roles {
  read = 'read',
  write = 'write',
  admin = 'admin'
}
export interface Empl {
  id: string
  firstname: string
  lastname: string
  role: string
  email: string
  createdAt: string
}

export const employees: Empl[] = [
  {
    id: '1',
    firstname: 'Jonas',
    lastname: 'Jonaitis',
    role: Roles.admin,
    email: 'email123',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    firstname: 'Petras',
    lastname: 'Petraitis',
    role: Roles.read,
    email: 'test@test.com',
    createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString()
  },
  {
    id: '3',
    firstname: 'Povilas',
    lastname: 'Povilaitis',
    role: Roles.read,
    email: 'email123',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    firstname: 'Juozas',
    lastname: 'Juozaitis',
    role: Roles.admin,
    email: 'test@gmail.com',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    firstname: 'Tomas',
    lastname: 'Tomaitis',
    role: Roles.admin,
    email: 'Vardenis2000@gmail.com',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    firstname: 'Giedrius',
    lastname: 'Giedraitis',
    role: Roles.write,
    email: 'Vardenis2@gmail.com',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    firstname: 'Justas',
    lastname: 'Justaitis',
    role: Roles.admin,
    email: 'email@gmail.com',
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    firstname: 'Laurynas',
    lastname: 'Laurinaitis',
    role: Roles.admin,
    email: 'pavardenis321@gmail.com',
    createdAt: new Date().toISOString()
  },
  {
    id: '9',
    firstname: 'Gerda',
    lastname: 'Gerdaitė',
    role: Roles.write,
    email: 'discordemail123@gmail.com.',
    createdAt: new Date().toISOString()
  },
  {
    id: '10',
    firstname: 'Kristina',
    lastname: 'Kristinaitė',
    role: Roles.read,
    email: 'pass1',
    createdAt: new Date().toISOString()
  }
]
