const express = require('express')
const tripRouter = express.Router()
const tripController = require('../controllers/trip.js')

const auth = require('../middleware/auth')

tripRouter
  .route('/')
  .get(tripController.fetchTrips)
  .post(auth, tripController.postTrips)

// tripRouter.post('/', auth, tripController.postTrips)

module.exports = tripRouter
