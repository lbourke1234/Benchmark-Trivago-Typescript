import mongoose from 'mongoose'
import supertest from 'supertest'
import dotenv from 'dotenv'
import { server } from '../server'
import UsersModel from '../apis/user/model'
import AccommodationModel from '../apis/accommodation/model'
import { generateJwt } from '../auth/tools'

dotenv.config()

const token = '62c011b67482bdaa208c3862'

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
  console.log(newAccom)
  await newAccom.save()
})

afterAll(async () => {
  await UsersModel.deleteMany()
  await mongoose.connection.close()
})

describe('Resource Tests', () => {
  test('GET /accommodation returns an array for Guests and Hosts', async () => {
    const response = await client
      .get('/accommodation')
      .set('Authorization', `Bearer ${token}`)
  })
  test('GET /accommodation/:id checks that return Id mathing params', async () => {})
  test('GET user/me will return the User information without password', async () => {
    const response = await client
      .get('/user/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
})
