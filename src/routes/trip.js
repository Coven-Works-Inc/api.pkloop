const express = require('express')
const tripRouter = express.Router()
const tripController = require('../controllers/trip.js')

tripRouter
  .route('/')
  .get(tripController.fetchTrips)
  .post(tripController.postTrips)

module.exports = tripRouter
