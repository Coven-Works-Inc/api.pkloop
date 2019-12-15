import { Schema, model } from 'mongoose'

const Parcel = new Schema({
  location: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  parcelSize: {
    type: String,
    required: true
  },
  parcelWeight: {
    type: String,
    required: true
  },
  additionalInfo: {
    type: String,
    required: true
  }
})

export default model('Parcel', Parcel)
