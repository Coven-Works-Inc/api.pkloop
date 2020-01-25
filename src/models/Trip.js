const mongoose = require('mongoose')
const { Schema, model } = require('mongoose')


const receiver = new Schema({
  fullname: String,
  address: String,
  phone: String
})
const tripSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  username: {
    type: String,
    required: [true, 'Username of trip poster']
  },

  locationCity: {
    type: String,
    required: [true, 'A traveler must have a loation City']
  },
  locationCountry: {
    type: String,
    required: [true, 'A traveler must have a location Country']
  },
  destinationCity: {
    type: String,
    required: [true, 'A traveler must have a destination City']
  },
  destinationCountry: {
    type: String,
    required: [true, 'A traveler must have a destination Country']
  },
  arrivalDate: {
    type: Date,
    required: [true, 'A trip must have an arrival date']
  },
  stopOvers: {
    type: [String]
  },
  parcelSize: {
    type: String,
    required: [true, "Please specify the parcel size you'll like to carry"]
  },
  parcelWeight: {
    type: String,
    required: [
      true,
      "Please specify the weight of the parcel you'll like carry"
    ]
  },
  transport: {
    type: String,
    required: [true, 'Please specify your transport mode']
  },
  additionalInfo: {
    type: String
  },
  receiver: receiver,
  earning: {
    type: Number,
    default: 0
  }
})

const Trip = model('Trip', tripSchema)

module.exports = Trip
