import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 9003

export const config = {
  server: {
    port: port
  }
}
