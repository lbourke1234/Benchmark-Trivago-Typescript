import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import mongoose from 'mongoose'
import {
  badRequestHandler,
  unauthorizedHandler,
  adminHandler,
  notFoundHandler,
  genericHandler
} from './errorHandlers.js'
import usersRouter from './apis/user/index.js'
import accommodationRouter from './apis/accommodation/index.js'
import authRouter from './apis/authRouter/index.js'

const server = express()
const port = 5001

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

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on('connected', () => {
  console.log('Connected to Mongo!')
  server.listen(port, () => {
    console.table(listEndpoints(server))
  })
})
