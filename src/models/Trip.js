const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  date_of_departure: {
    type: Date,
    required: true
  },
  stop_over: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  date_of_arrival: {
    type: Date,
    required: true
  }
})

const Trip = mongoose.model('Trip', tripSchema)

module.exports = Trip
