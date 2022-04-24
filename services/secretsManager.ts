import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' })
}

export const ACCESS_TOKEN_SECRET = process.env['ACCESS_TOKEN_SECRET']
export const REFRESH_TOKEN_SECRET = process.env['REFRESH_TOKEN_SECRET']
