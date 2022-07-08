import createHttpError from 'http-errors'
import { RequestHandler, Request } from 'express'

interface AuthenticationRequest extends Request {
  user?: {
    role: string
  }
}

const hostOnly: RequestHandler = (req: AuthenticationRequest, res, next) => {
  if (req.user && req.user.role === 'guest') {
    next(createHttpError(403, 'You must be a host to gain access!'))
  } else {
    next()
  }
}
export default hostOnly
