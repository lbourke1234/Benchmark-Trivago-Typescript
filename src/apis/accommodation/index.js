import express from 'express'
import createHttpError from 'http-errors'
import JwtChecker from '../../auth/JWTChecker.js'
import AccommodationModel from './model.js'
import hostOnly from '../../auth/hostOnly.js'

const router = express.Router()

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

router.put('/:id', JwtChecker, hostOnly, async (req, res, next) => {
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
    next(createHttpError(404, "Accommodation not found or it's not yours"))
  }
})

router.delete('/:id', JwtChecker, hostOnly, async (req, res, next) => {
  try {
    const hostAccoms = await AccommodationModel.find({ host: req.user.id })

    const accomToDelete = hostAccoms.find((acc) => acc._id.toString() === req.params.id)

    if (accomToDelete) {
      const deletedAccom = await AccommodationModel.findByIdAndDelete(req.params.id)
      if (deletedAccom) {
        res.status(204).send()
      } else {
        next(createHttpError(404, 'Accommodation not found'))
      }
    } else {
      next(createHttpError(404, 'Not your accommodation!/ Not found'))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default router
