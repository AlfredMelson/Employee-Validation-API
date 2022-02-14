import approvedOrigins from './approvedOrigins'

const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (approvedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not approved by CORS'))
    }
  },
  optionsSuccessStatus: 200
}

export default corsOptions
