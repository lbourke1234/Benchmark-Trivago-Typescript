import mongoose, { Model, Document } from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema, model } = mongoose

interface User {
  email: string
  password: string
  role: string
  refresh: string
}

interface UserDocument extends User, Document {}

interface UserModel extends Model<UserDocument> {
  checkCredentials(email: string, password: string): Promise<UserDocument | null>
}

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String },
  role: { type: String, enum: ['host', 'guest'] },
  refresh: { type: String }
})

UserSchema.pre('save', async function (next) {
  const currentUser = this
  const plainPW = this.password
  if (plainPW) {
    if (currentUser.isModified('password')) {
      const hash = await bcrypt.hash(plainPW, 11)
      currentUser.password = hash
    }
    next()
  }
})

UserSchema.methods.toJSON = function () {
  const userDocument = this
  const userObject = userDocument.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

UserSchema.static('checkCredentials', async function (email, plainPW) {
  const user = await this.findOne({ email })

  if (user) {
    const isMatch = await bcrypt.compare(plainPW, user.password)
    if (isMatch) {
      return user
    } else {
      return null
    }
  }
})

export default model<UserDocument, UserModel>('User', UserSchema)
