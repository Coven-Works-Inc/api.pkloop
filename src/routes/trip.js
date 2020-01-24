const express = require('express')
const tripRouter = express.Router()
const tripController = require('../controllers/trip.js')

const auth = require('../middleware/auth')

tripRouter.get('/', tripController.fetchTrips)
tripRouter.post('/', auth, tripController.postTrips)
tripRouter.get('/trip/:id', tripController.getTrip)
tripRouter.post('/trip/receiver', tripController.addReceiver)

//The fetch shippers route is not an authenticated route
tripRouter.get('/shippers', tripController.fetchShippers)

module.exports = tripRouter
