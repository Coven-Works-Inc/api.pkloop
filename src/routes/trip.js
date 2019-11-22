const express = require('express')
const tripRouter = express.Router
const tripController = require('../controllers/trip')

tripRouter.get('/', tripController.fetchTrips)
