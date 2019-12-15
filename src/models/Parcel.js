const { Schema, model } = require('mongoose')

const parcelSchema = new Schema({
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

const Parcel = model('Parcel', parcelSchema)

module.exports = Parcel
