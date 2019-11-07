import { Schema, model } from 'mongoose'

const Parcel = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

export default model('Parcel', Parcel)
