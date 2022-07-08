import express from 'express'
import { Request, RequestHandler } from 'express'
import createHttpError from 'http-errors'
import hostOnly from '../../auth/hostOnly'
import JwtChecker from '../../auth/JWTChecker'
import UserModel from './model'
import AccommodationModel from '../accommodation/model'
import { generateRefreshJwt } from '../../auth/tools'
import { ObjectId } from 'mongoose'

interface UserRequest extends Request {
  user?: {
    id: ObjectId
    role: string
  }
}

const router = express.Router()

router.get('/me', JwtChecker, async (req: UserRequest, res, next) => {
  try {
    if (req.user) {
      const user = await UserModel.findById(req.user.id)
      res.send(user)
    } else {
      createHttpError(404, "You don't exist")
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.get(
  'me/accommodation',
  JwtChecker,
  hostOnly,
  async (req: UserRequest, res, next) => {
    try {
      if (!req.user) {
        createHttpError(404, 'Not found')
      } else {
        const accommodations = await AccommodationModel.find({ host: req.user.id })
        res.send(accommodations)
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

router.post('me/refresh', JwtChecker, async (req: UserRequest, res, next) => {
  try {
    if (!req.user) {
      createHttpError(404, 'Not found')
    } else {
      const user = await UserModel.findById(req.user.id)
      if (user) {
        const refresh = await generateRefreshJwt({ _id: user._id })
        user.refresh = refresh
        res.send({ user, refresh })
      }
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default router
