import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import verifyJWT from './middleware/verifyJWT'
import credentials from './middleware/credentials'
import cookieParser from 'cookie-parser'
import registerAdminRouter from './routes/registerAdmin'
import authAdminRouter from './routes/authAdmin'
import refreshAdminRouter from './routes/refreshAdmin'
import logoutAdminRouter from './routes/logoutAdmin'
import itemsRouter from './routes/api/items'
// import { corsOptionsDelegate } from './config/corsOptions'
// import corsOptions from './config/corsOptions'
// import errorHandler from './middleware/errorHandler'
// import { logger } from './middleware/logEvents'

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
app.use('/register', registerAdminRouter)
app.use('/auth', authAdminRouter)
app.use('/refresh', refreshAdminRouter)
app.use('/logout', logoutAdminRouter)

// verification of jsonwebtoken
app.use(verifyJWT)

// routes after verification of jsonwebtoken
app.use('/items', itemsRouter)

// middleware for handling errors
// app.use(errorHandler)

export default app
