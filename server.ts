import express from 'express'
const app = express()
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
// const { logger } = require('./middleware/logEvents')
// const employeeInitialization = require('./middleware/employeeInitialization')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const items = require('./endpoints/itemsEndpoint')

// middleware for logging events
// app.use(logger)

// initialize the database
// app.use(employeeInitialization)

// Handle options credentials check before CORS and fetch cookies credentials requirement
app.use(credentials)

// cross origin resource sharing configuration
app.use(cors(corsOptions))

// built-in express middleware for handling url encoded data
app.use(express.urlencoded({ extended: false }))

// built-in express middleware for handling json
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

// routes
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

// verification of jsonwebtoken
app.use(verifyJWT)

// routes after verification of jsonwebtoken
app.use(items)
app.use('/employees', require('./routes/api/employees'))

// middleware for handling errors
app.use(errorHandler)

app.listen(9003, 'localhost')
console.log('server is running on port:', 9003)
