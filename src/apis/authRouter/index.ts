import express, { Request } from 'express'
import createHttpError from 'http-errors'
import { generateJwt } from '../../auth/tools'
import UserModel from '../user/model'

const router = express.Router()

router.post('/register', async (req, res, next) => {
  try {
    const user = await new UserModel(req.body).save()

    const token = await generateJwt({ _id: user._id })

    if (!user && !token) {
      createHttpError(401, 'Invalid Request')
    } else {
      res.status(201).send({ user, token })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  const { email, password, role } = req.body

  const user = await UserModel.checkCredentials(email, password)

  if (!user) {
    next(createHttpError(400, 'Email/Password does not match'))
  } else {
    const token = await generateJwt({ _id: user._id, role })
    res.send({ token })
  }
})

export default router
