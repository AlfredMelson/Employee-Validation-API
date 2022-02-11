const logEvents = require('./logEvents')
import { Response } from 'express'

const errorHandler = (err, res: Response) => {
  logEvents(`${err.name}:${err.message}`, 'errorLog.txt')
  // console.error(err.stack)
  res.status(500).send(err.message)
}

module.exports = errorHandler
