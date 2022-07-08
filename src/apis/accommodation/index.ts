import express, { Request } from 'express'
import createHttpError from 'http-errors'
import JwtChecker from '../../auth/JWTChecker'
import AccommodationModel from './model'
import hostOnly from '../../auth/hostOnly'
import { ObjectId } from 'mongoose'

const router = express.Router()

interface UserRequest extends Request {
  user?: {
    id: ObjectId
    role: string
  }
}

router.get('/', JwtChecker, async (req, res, next) => {
  try {
    const accommodations = await AccommodationModel.find()
    res.send(accommodations)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.get('/:id', JwtChecker, async (req, res, next) => {
  try {
    const accommodation = await AccommodationModel.findById(req.params.id)
    res.send(accommodation)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post('/', JwtChecker, hostOnly, async (req, res, next) => {
  try {
    const newAccommodation = await new AccommodationModel(req.body).save()
    res.send(newAccommodation)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.put('/:id', JwtChecker, hostOnly, async (req: UserRequest, res, next) => {
  if (req.user) {
    const hostAccoms = await AccommodationModel.find({ host: req.user.id })
    console.log(hostAccoms)

    const accomsToUpdate = hostAccoms.find((acc) => acc._id.toString() === req.params.id)
    console.log(accomsToUpdate)

    if (accomsToUpdate) {
      const updatedAccommodation = await AccommodationModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
      res.send(updatedAccommodation)
    } else {
      createHttpError(404, 'user nor found')
    }
  } else {
    next(createHttpError(404, "Accommodation not found or it's not yours"))
  }
})

router.delete('/:id', JwtChecker, hostOnly, async (req: UserRequest, res, next) => {
  try {
    if (!req.user) {
      createHttpError(404, 'User not found')
    } else {
      const hostAccoms = await AccommodationModel.find({ host: req.user.id })

      const accomToDelete = hostAccoms.find((acc) => acc._id.toString() === req.params.id)

      if (accomToDelete) {
        const deletedAccom = await AccommodationModel.findByIdAndDelete(req.params.id)
        if (deletedAccom) {
          res.status(204).send()
        }
      } else {
        next(createHttpError(404, 'Accommodation not found'))
      }
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default router
