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
transRouter.post(
  '/completetraveler',
  auth,
  transController.completeTravelerTransaction
)
transRouter.post(
  '/completesender',
  auth,
  transController.completeSenderTransaction
)
transRouter.post('/updatetrans', auth, transController.updateTransactionDetails)
transRouter.post('/connect', auth, transController.sendConnect)
transRouter.post('/respond', auth, transController.respondAction)
transRouter.post('/redeemcode', auth, transController.redeemCode)
transRouter.post('/addtip', auth, transController.addTip)
transRouter.post('/payinsurance', auth, transController.payInsurance)
transRouter.get('/notif', auth, transController.fetchNotif)
transRouter.post('/cancel', auth, transController.cancelAction)

module.exports = transRouter
