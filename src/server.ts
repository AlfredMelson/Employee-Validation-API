import app from './app'

const port = 9003

// Express server
const server = app.listen(port, () => {
  console.log('Express server has been started on port ', port)
})

export default server
