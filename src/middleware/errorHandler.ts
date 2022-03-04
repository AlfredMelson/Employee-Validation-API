import type { Request, Response } from 'express'

import { logEvents } from './logEvents'

const errorHandler = (err: { name: any; message: any }, _req: Request, res: Response) => {
  logEvents(`${err.name}:${err.message}`, 'errorLog.txt')
  // console.error(err.stack)
  res.status(500).send(err.message)
}

export default errorHandler
