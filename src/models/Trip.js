const mongoose = require('mongoose')
const { Schema, model } = require('mongoose')
const crypto = require('crypto')

const receiver = new Schema({
  fullname: String,
  address: String,
  phone: String
})
const message = new Schema({
  text: String,
  isOwn: {
    type: String,
    enum: ['traveler', 'sender']
  }
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
  },
  requestStatus: {
    type: String,
    enum: ['listed', 'requested', 'accepted'],
    default: 'listed'
  },
  tipAdded: {
    type: Boolean,
    default: false
  },
  insuranceAdded: {
    type: Boolean,
    default: false
  },
  tipAmount: {
    type: Number,
    default: 0
  },
  insuranceAmount: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
  parcelCost: {
    type: Number,
    default: 0
  },
  secretCode: {
    type: String
  },
  messages: [message],
  secret: String
})

tripSchema.pre('save', function (next) {
  this.secretCode = crypto.randomBytes(4).toString('hex')
  next()
})

const Trip = model('Trip', tripSchema)

module.exports = Trip
