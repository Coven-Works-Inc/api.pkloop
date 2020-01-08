const express = require('express')

const bookingController = require('../controllers/bookings')
const auth = require('../middleware/auth')

const bookingRouter = express.Router()

bookingRouter.get(
  '/checkout-session',
  auth,
  bookingController.getCheckoutSession
)
