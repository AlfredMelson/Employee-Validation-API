import type { Response } from 'express'
import { logEvents } from './logEvents'

const errorHandler = (err: { name: any; message: any }, res: Response) => {
  logEvents(`${err.name}:${err.message}`, 'errorLog.txt')
  // console.error(err.stack)
  res.status(500).send(err.message)
}

export default errorHandler
