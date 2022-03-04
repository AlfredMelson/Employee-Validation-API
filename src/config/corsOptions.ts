import approvedOrigins from './approvedOrigins'

/*
 * Types from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/cors
 */

type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[]

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, origin?: StaticOrigin) => void
  ) => {
    if (origin !== undefined) {
      if (approvedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not approved by CORS'))
      }
    }
  },
  optionsSuccessStatus: 200
}

export default corsOptions
