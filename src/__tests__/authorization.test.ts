import mongoose from 'mongoose'
import supertest from 'supertest'
import dotenv from 'dotenv'
import { server } from '../server'
import UsersModel from '../apis/user/model'
import { verifyJwt } from '../auth/tools'
import { TokenPayload } from '../auth/tools'

dotenv.config()

const client = supertest(server)

const validLogin = {
  email: 'a@a.com',
  password: '12345'
}

interface newRegister {
  email: string
  password: string
  role: 'guest' | 'host'
}
const newUser: newRegister = {
  email: 'a@a.com',
  password: '12345',
  role: 'guest'
}

const validRegistration: newRegister = {
  email: 'test@test.com',
  password: '12345',
  role: 'guest'
}
const invalidRegistration = {
  email: 'hello',
  password: '12345',
  role: 'guests'
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_CONNECTION!)
  const newestUser = new UsersModel(newUser)
  console.log('NEWEST USER: ', newestUser)
  await newestUser.save()
})

afterAll(async () => {
  await UsersModel.deleteMany()
  await mongoose.connection.close()
})
describe('Testing authorization', () => {
  test('Checks POST /register returns 201 if valid and returns JWT token', async () => {
    const response = await client
      .post('/auth/register')
      .send(validRegistration)
      .expect(201)
    const payload = verifyJwt(response.body.token)
    expect(response.body.token).toBeDefined
  })
  test('Checks if invalid request returns 400', async () => {
    await client.post('/auth/register').send(invalidRegistration).expect(400)
  })
  test('Valid login returns 200 and valid JWT token', async () => {
    await client.post('/auth/login').send(validLogin).expect(200)
  })
  test('Invalid information will return a 400', async () => {
    await client
      .post('/auth/login')
      .send({ email: 'a@a.com', password: '123456' })
      .expect(400)
  })
})
