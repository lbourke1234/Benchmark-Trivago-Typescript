import mongoose from 'mongoose'
import supertest from 'supertest'
import dotenv from 'dotenv'
import { server } from '../server'
import UsersModel from '../apis/user/model'
import AccommodationModel from '../apis/accommodation/model'
import { generateJwt, verifyJwt } from '../auth/tools'
import { validRegistration } from './authorization.test'

dotenv.config()

const client = supertest(server)

const accomm = {
  name: 'Villa',
  host: '62c0135f1b9c20594678e165',
  description: 'Very Nice',
  maxGuests: 6,
  city: 'Barcelona'
}
// let newAccom = {}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_CONNECTION!)
  let newAccom = new AccommodationModel(accomm)
  //   const token = generateJwt({ _id: newAccom._id })
  console.log(newAccom)
  await newAccom.save()
})

afterAll(async () => {
  await UsersModel.deleteMany()
  await mongoose.connection.close()
})

describe('Resource Tests', () => {
  test('GET /accommodation returns an array for Guests and Hosts', async () => {
    const { body } = await client.post('/auth/register').send(validRegistration)
    const payload = verifyJwt(body.token)
    console.log('BODY', body)

    const response = await client
      .get('/accommodation')
      .set('Authorization', `Bearer ${body.token}`)
  })
  test('GET /accommodation/:id checks that return Id mathing params', async () => {})
  test('GET user/me will return the User information without password', async () => {
    const { body } = await client.post('/auth/register').send(validRegistration)
    console.log('BODYBODYBODY', body)

    const response = await client
      .get('/user/me')
      .set('Authorization', `Bearer ${body.token}`)
      .expect(200)

    console.log('RESPONSE WE NEED', response)
  })
})
