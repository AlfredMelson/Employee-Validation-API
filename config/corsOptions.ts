export const corsOptions = {
  origin: (origin: string, callback) => {
    const approvedOrigins = ['http://localhost:3000']

    if (approvedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}

module.exports = corsOptions
