import createHttpError from 'http-errors'
import { verifyJwt } from './tools'
import UsersModel from '../apis/user/model'
import { RequestHandler, Request } from 'express'
import { ObjectId } from 'mongoose'

export interface AuthenticationRequest extends Request {
  user?: {
    id: ObjectId
    // role: 'host' | 'guest'
  }
}

const JwtChecker: RequestHandler = async (req: AuthenticationRequest, res, next) => {
  try {
    if (!req.headers.authorization) {
      next(createHttpError(401, 'You do not have a bearer token'))
    } else {
      const token = req.headers.authorization.split(' ')[2]
      const payload = await verifyJwt(token)

      const user = await UsersModel.findById(payload._id)
      if (user) {
        req.user = {
          id: payload._id
          // role: payload_role
        }
        next()
      }
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export default JwtChecker
