const express = require('express')

const paymentController = require('../controllers/payment')
const auth = require('../middleware/auth')

const { getpay, postpay, connectUser, getStripeId, payUser } = paymentController

const paymentRouter = express.Router()

paymentRouter.get('/', auth, getpay)
paymentRouter.get('/stripe', auth, getStripeId)
paymentRouter.post('/', auth, postpay)
paymentRouter.post('/connect', auth, connectUser)
paymentRouter.post('/payout', auth, payUser)

module.exports = paymentRouter
