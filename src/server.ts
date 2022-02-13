import app from './app'

// Start Express server
const server = app.listen(9003, 'localhost')
console.log('server is running on port:', 9003)

export default server
