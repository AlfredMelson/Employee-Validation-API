import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import verification from './middleware/verification'
import credentials from './middleware/credentials'
import cookieParser from 'cookie-parser'
import {
  adminRegisterRoute,
  adminAuthRoute,
  adminRefreshRoute,
  adminLogoutRoute
} from './routes/admin'
import {
  emplDeletionRoute,
  emplGetAllRoute,
  emplGetOneRoute,
  emplRegisterRoute,
  emplUpdateRoute
} from './routes/empl'
// import { logger } from './middleware/logEvents'
// import { corsOptionsDelegate } from './config/corsOptions'
// import corsOptions from './config/corsOptions'
// import errorHandler from './middleware/errorHandler'

const app = express()

// middleware for logging events
// app.use(logger)

// Handle options credentials check before CORS and fetch cookies credentials requirement
app.use(credentials)

// cross origin resource sharing configuration
// enable pre-flight across-the-board
app.options('*', cors)
// app.use(cors(corsOptionsDelegate))
// app.use(cors(corsOptions))

// middleware for handling json
app.use(bodyParser.json())

// middleware for handling url encoded data
app.use(bodyParser.urlencoded({ extended: true }))

//middleware for cookies
app.use(cookieParser())

// routes
app.use('/admin', adminRegisterRoute)
app.use('/admin', adminAuthRoute)
app.use('/admin', adminRefreshRoute)
app.use('/admin', adminLogoutRoute)

// routes after verification of jsonwebtoken
app.use('/api', emplGetOneRoute)
app.use('/api', emplGetAllRoute)
app.use('/api', emplRegisterRoute)
app.use('/api', emplUpdateRoute)
app.use('/api', emplDeletionRoute)

// verification of jsonwebtoken
app.use(verification)

// middleware for handling errors
// app.use(errorHandler)

export default app
