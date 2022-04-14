import express from 'express'
import cors from 'cors'
// import verification from './middleware/verification'
import credentials from './middleware/credentials'
import cookieParser from 'cookie-parser'
import { adminAuthRoute, adminRefreshRoute, adminLogoutRoute } from './routes/admin'
import {
  emplDeletionRoute,
  emplGetAllRoute,
  emplGetOneRoute,
  emplRegisterRoute,
  emplUpdateRoute
} from './routes/empl'
import corsOptions from './config/corsOptions'
import path from 'path'
import { logger } from './middleware/logEvents'
import errorHandler from './middleware/errorHandler'
import type { Request, Response } from 'express'
import bodyParser from 'body-parser'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const PORT = process.env.PORT || 9003

const app = express()

// middleware for logging events
app.use(logger)

// Handle options credentials check before CORS and fetch cookies credentials requirement
app.use(credentials)

// cross origin resource sharing configuration
app.use(cors(corsOptions))

// middleware for handling json
app.use(bodyParser.json())

// middleware for handling url encoded data
app.use(bodyParser.urlencoded({ extended: true }))

// built-in middleware to handle urlencoded form data
// app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
// app.use(express.json())

//middleware for cookies
app.use(cookieParser())

// routes
app.use('/admin', adminAuthRoute)
app.use('/admin', adminLogoutRoute)
app.use('/admin', adminRefreshRoute)

// routes after verification of jsonwebtoken
app.use('/api', emplGetOneRoute)
app.use('/api', emplGetAllRoute)
app.use('/api', emplRegisterRoute)
app.use('/api', emplUpdateRoute)
app.use('/api', emplDeletionRoute)

// verification of jsonwebtoken
// app.use(verification)

// dev catch-all (404)
app.all('*', (req: Request, res: Response) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

// middleware for handling errors
app.use(errorHandler)

// Express server
const server = app.listen(PORT, () => {
  console.log('Express server has been started on port ', PORT)
})

export default server
