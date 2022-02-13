export const allowedUrls = ['http://example1.com', 'http://localhost:3000']

export const corsOptionsDelegate = function (req: any, callback: any) {
  let corsOptions: { origin: boolean }
  if (allowedUrls.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(new Error('Not allowed by CORS'), corsOptions) // callback expects two parameters: error and options
}

// testing cors
// export const corsOptions = {
//   origin: (origin: string, callback: any) => {
//     const approvedOrigins = ['http://localhost:3000']

//     if (approvedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   optionsSuccessStatus: 200
// }
