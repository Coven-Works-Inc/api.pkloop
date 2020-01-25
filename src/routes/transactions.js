const express = require('express')
const transRouter = express.Router()

const transController = require('../controllers/transactions')
const auth = require('../middleware/auth')

transRouter.post('/', auth, transController.postTransaction)
transRouter.get('/fetchTransactions', transController.fetchTransactions)
transRouter.get(
  '/fetchMyTransactions',
  auth,
  transController.fetchMyTransactions
)
transRouter.post('/completetraveler', auth, transController.completeTravelerTransaction)
transRouter.post('/completesender', auth, transController.completeSenderTransaction)

module.exports = transRouter
