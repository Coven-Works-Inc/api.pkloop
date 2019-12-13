const mongoose = require('mongoose')
const { Schema, model } = require('mongoose')

const tripSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    type: String,
    required: [true, 'Please enter your the location you will be leaving from']
  },
  destination: {
    type: String,
    required: [true, 'A trip must have a destination']
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
  }
})

const Trip = model('Trip', tripSchema)

exports.Trip = Trip
