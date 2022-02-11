import { logEvents } from './logEvents'
import { Request, Response, NextFunction } from 'express'

const errorHandler = (err, res: Response) => {
  logEvents(`${err.name}:${err.message}`, 'errorLog.txt')
  // console.error(err.stack)
  res.status(500).send(err.message)
}

module.exports = errorHandler
