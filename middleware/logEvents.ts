import type { Request, NextFunction, Response } from 'express'
import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import { existsSync } from 'fs'
import path from 'path'
import { appendFile, mkdir } from 'fs/promises'

export const logEvents = async (message: string, logName: string) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  try {
    if (!existsSync(path.join(__dirname, '..', 'logs'))) {
      mkdir(path.join(__dirname, '..', 'logs'))
    }

    await appendFile(path.join(__dirname, '..', 'logs', logName), logItem)
  } catch (err) {
    console.log(err)
  }
}

export const logger = (req: Request, _res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
  console.log(`${req.method} ${req.path}`)
  next()
}
