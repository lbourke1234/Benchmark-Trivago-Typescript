import express from 'express'
import createHttpError from 'http-errors'
import hostOnly from '../../auth/hostOnly.js'
import JwtChecker from '../../auth/JWTChecker.js'
import UserModel from './model.js'
import AccommodationModel from '../accommodation/model.js'
import { generateRefreshJwt } from '../../auth/tools.js'

const router = express.Router()

router.get('/me', JwtChecker, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id)
    res.send(user)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.get('me/accommodation', JwtChecker, hostOnly, async (req, res, next) => {
  try {
    const accommodations = await AccommodationModel.find({ host: req.user.id })
    res.send(accommodations)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post('me/refresh', JwtChecker, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id)
    const refresh = await generateRefreshJwt({ id: user._id })
    user.refresh = refresh
    res.send({ user, refresh })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default router
