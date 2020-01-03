const express = require('express')
const tripRouter = express.Router()
const tripController = require('../controllers/trip.js')

const auth = require('../middleware/auth')

tripRouter
  .route('/')
  .get(tripController.fetchTrips)
  .post(auth, tripController.postTrips)

//The fetch shippers route is not an authenticated route
tripRouter.get('/shippers', tripController.fetchShippers)

module.exports = tripRouter
