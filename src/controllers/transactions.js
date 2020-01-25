const Transaction = require('../models/Transaction')
const User = require('../models/User')
const Trip = require('../models/Trip')

const postTransaction = async (req, res, next) => {
  const user = await User.findById(req.user._id)
  const trip = await Trip.findById(req.body.tripId)

  const transaction = new Transaction({
    user: user.id,
    status: req.body.status,
    with: req.body.with,
    role: req.body.role,
    tripId: req.body.tripId
  })

  const travelerTransaction = new Transaction({
    user: req.body.travelerId,
    status: req.body.status,
    with: req.body.senderName,
    role: 'Traveller',
    tripId: req.body.tripId
  })

  await transaction.save()
  await travelerTransaction.save()

  res
    .status(200)
    .json({
      status: true,
      sender: transaction,
      traveller: travelerTransaction,
      trip
    })
}
const fetchTransactions = async (req, res, next) => {
  const transactions = await Transaction.find()

  let message
  let payload = []

  if (!transactions) {
    payload = []
    message = 'No transactions found'
  } else {
    ;(payload = transactions),
      (message = `Found ${transactions.length} transactions`)
  }

  return res.status(200).json({ status: true, payload })
}

const fetchMyTransactions = async (req, res, next) => {
  const transactions = await Transaction.find({ user: req.user._id })

  res.status(200).json({ status: true, data: transactions })
}

const completeTravelerTransaction = async (req, res) => {
  const transaction = await Transaction.updateMany({ tripId: req.body.id}, {$set: { travelerComplete: true}})
  await transaction.save()
  res.status(200).json({ status: true, transaction })
}

const completeSenderTransaction = async (req, res) => {
  const transaction = await await Transaction.updateMany({ tripId: req.body.id}, {$set: { senderComplete: true}})
  await transaction.save()
  res.status(200).json({ status: true, transaction })
}
module.exports = {
  postTransaction,
  fetchTransactions,
  fetchMyTransactions,
  completeSenderTransaction,
  completeTravelerTransaction
}
