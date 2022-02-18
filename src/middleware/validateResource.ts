import type { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from 'zod'

/*
validateResource is a curried function that takes the zod created schema and then it will take the  request objects (when the admin makes a request) .  It will then validate the request object against the schema and if it passes it will call the next function in the middleware chain.  If it fails it will send a status code of 400 and a message to the client.

validateResouce is called with the schema and return a function that takes the request and response objects and validates the request object against the schema.
*/
const validateResource =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      })

      // if the scheme passes, call next
      next()
    } catch (error: any) {
      // if the scheme fails based on the payload provided, send a status code of 400 and a message to the client
      return res.status(400).send(error.errors)
    }
  }

export default validateResource
