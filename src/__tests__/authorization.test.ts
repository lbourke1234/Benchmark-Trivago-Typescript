import mongoose from 'mongoose'
import supertest from 'supertest'
import dotenv from 'dotenv'
import { server } from '../server'

dotenv.config()

const client = supertest(server)

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_CONNECTION!)
})

afterAll(async () => {
  await mongoose.connection.close()
})
describe('Testing authorization', () => {
  test('tests if ture === true', () => {
    expect(true).toBe(true)
  })
})
