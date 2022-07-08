import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongoose'

export interface TokenPayload {
  _id: ObjectId
  role?: string
}

export const generateJwt = (payload: TokenPayload): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1 week' }, (err, token) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(token as string)
      }
    })
  })
}

export const generateRefreshJwt = (payload: TokenPayload): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1 week' }, (err, token) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(token as string)
      }
    })
  })
}

export const verifyJwt = (token: string): Promise<TokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(payload as TokenPayload)
      }
    })
  })
}
