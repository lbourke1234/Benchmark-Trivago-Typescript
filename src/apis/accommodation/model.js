import mongoose from 'mongoose'

const { Schema, model } = mongoose

const AccommodationSchema = new Schema({
  name: { type: String, required: true },
  host: { type: mongoose.Types.ObjectId, ref: 'User' },
  description: { type: String, required: true },
  maxGuests: { type: Number, required: true },
  city: { type: String, required: true }
})

AccommodationSchema.methods.toJSON = function () {
  const userDocument = this
  const userObject = userDocument.toObject()

  delete userObject.__v

  return userObject
}

export default model('Accommodation', AccommodationSchema)
