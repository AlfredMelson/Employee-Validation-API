import { object, string, TypeOf } from 'zod'
/*
  id: number
  username: string
  email: string
  password: string
  refreshToken?: string
*/

export const createAdminSchema = object({
  body: object({
    adminUsername: string({
      required_error: 'Username is required'
    }),
    adminPassword: string({
      required_error: 'Password is required'
    }).min(6, 'Password is too short - should be min 6 chars'),
    adminEmail: string({
      required_error: 'Email is required'
    }).email('Not a valid email')
  })
})

export const verifyAdminSchema = object({
  params: object({
    id: string(),
    verificationCode: string()
  })
})

export type CreateAdminInput = TypeOf<typeof createAdminSchema>['body']

export type VerifyAdminInput = TypeOf<typeof verifyAdminSchema>['params']
