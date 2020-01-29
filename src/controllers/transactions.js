const Transaction = require('../models/Transaction')
const User = require('../models/User')
const Trip = require('../models/Trip')
const { sendEmail } = require('../utils/email')
const uuid = require('uuid/v4')
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
  await Transaction.updateMany({ tripId: req.body.id}, {$set: { travelerComplete: true, status: 'Completed' } })
  res.status(200).json({ status: true })
}

const updateTransactionDetails = async (req, res) => {
  const trip = await Trip.findById(req.body.id)
  trip.tipAmount = req.body.tipAmount,
  trip.tipAdded = req.body.tipAdded,
  trip.insuranceAmount = req.body.insuranceAmount,
  trip.insuranceAdded = req.body.insuranceAdded,
  trip.totalCost = req.body.totalCost,
  trip.parcelCost = req.body.parcelCost
  await trip.save()
  res.status(200).json({ trip })
}
const completeSenderTransaction = async (req, res) => {
  const trip = await Trip.findById(req.body.id)
  const user = await User.findById(req.user._id)
  if(trip.complete){
      user.balance += Number(req.body.earning)
      user.amountMade += Number(req.body.earning)
      await user.save()
      res.status(200).json({
        status: true,
        user,
        trip
      })
  }
  else {
    res.status(200).json({ status: true, message: 'Transaction is not yet marked complete by sender', trip})
  }
}
const connectTraveler = async(req, res) => {
  const trip = await Trip.findById(req.body.tripId)
  const user = await User.findById(req.body.id)
  const senderMail = req.user.email
  let headers = req.headers.host
  await user.notifications.push({ id: req.body.id, text: `${req.body.username} has connected with you, respond by accepting or rejecting` })
  trip.earning = req.body.earning
  sendEmail(senderMail, req.user.username, headers, null, 'connectSender')
  sendEmail(user.email, req.body.username, headers, null, 'connectTraveler')
  await user.save()
  await trip.save()
  res.status(200).json({ message: 'Connection successful', user, trip })
}
const respondAction = async (req, res) => {
  const user = await User.findById(req.body.id)
  const action = req.body.action
  if(action === 'accept'){
    sendEmail(req.user.email, req.user.username, headers, null, 'acceptTraveler')
    sendEmail(user.email, user.username, headers, null, 'acceptSender')
  } else if(action === 'decline') {
    sendEmail(req.user.email, req.user.username, headers, null, 'declineTraveler')
    sendEmail(user.email, user.username, headers, null, 'declineSender')
  }
}
module.exports = {
  postTransaction,
  fetchTransactions,
  fetchMyTransactions,
  completeSenderTransaction,
  completeTravelerTransaction,
  updateTransactionDetails,
  connectTraveler,
  respondAction
}
