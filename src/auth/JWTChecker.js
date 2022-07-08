import createHttpError from 'http-errors'
import { verifyJwt } from './tools.js'
import UsersModel from '../apis/user/model.js'

const JwtChecker = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      next(createHttpError(401, 'You do not have a bearer token'))
    } else {
      const token = req.headers.authorization.split(' ')[2]
      const payload = await verifyJwt(token)

      const user = await UsersModel.findById(payload.id)
      req.user = {
        id: payload.id,
        role: payload.role
      }
      next()
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export default JwtChecker
