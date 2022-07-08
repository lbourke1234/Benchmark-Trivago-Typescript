import express from 'express'
import cors from 'cors'
import {
  badRequestHandler,
  unauthorizedHandler,
  adminHandler,
  notFoundHandler,
  genericHandler
} from './errorHandlers'
import usersRouter from './apis/user'
import accommodationRouter from './apis/accommodation'
import authRouter from './apis/authRouter'

const server = express()

server.use(cors())
server.use(express.json())

server.use('/users', usersRouter)
server.use('/accommodation', accommodationRouter)
server.use('/auth', authRouter)

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(adminHandler)
server.use(notFoundHandler)
server.use(genericHandler)

export { server }
