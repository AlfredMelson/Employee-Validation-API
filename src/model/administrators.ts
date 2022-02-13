export interface IAdministrators {
  id: number
  username: string
  email: string
  password: string
  refreshToken?: string
}

export const administrators = [
  {
    id: 1,
    username: 'admin',
    password: '$2b$10$EfdfG6Bgfpw2ePOVR8iNUOYWIVEkxd9l7MXXmGt8Zyg68MoEIzK.W',
    email: 'user@organization.com',
    refreshToken: ''
  }
]
