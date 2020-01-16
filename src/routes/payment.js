const express = require('express')

const paymentController = require('../controllers/payment')
const auth = require('../middleware/auth')

const { getpay, postpay } = paymentController

const paymentRouter = express.Router()

paymentRouter.get('/', auth, getpay)
paymentRouter.post('/', auth, postpay)

module.exports = paymentRouter
