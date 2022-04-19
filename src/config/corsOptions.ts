import approvedOrigins from './approvedOrigins'

/*
 * Types from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/cors
 */

type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[]

const corsOptions = {
  origin: (
    requestOrigin: string | undefined,
    callback: (err: Error | null, origin?: StaticOrigin) => void
  ) => {
    if (requestOrigin !== undefined) {
      if (approvedOrigins.indexOf(requestOrigin) !== -1 || !requestOrigin) {
        callback(null, true)
      } else {
        callback(new Error('Not approved by CORS'))
      }
    }
  },
  optionsSuccessStatus: 200
}

export default corsOptions
