import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'

export const generateJwt = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1 week' }, (err, token) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

export const generateRefreshJwt = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1 week' }, (err, token) => {
      if (err) {
        console.log(err)
        rej(err)
      } else {
        resolve(token)
      }
    })
  })
}

export const verifyJwt = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(payload)
      }
    })
  })
}
