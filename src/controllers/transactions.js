const Transaction = require('../models/Transaction')
const User = require('../models/User')
const Trip = require('../models/Trip')
const RedeemCode = require('../models/RedeemCode')
const senderMail = require('../utils/email/trips/sender')
const travelerMail = require('../utils/email/trips/traveler')
const rejectMail = require('../utils/email/trips/reject')
const sendConnectEmail = require('../utils/email/trips/connect')
const uuid = require('uuid/v4')
const axios = require('axios')
const qs = require('querystring')

require('dotenv').config()

const URL = process.env.INSURANCE_URL

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

  res.status(200).json({
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
  await Transaction.updateMany(
    { tripId: req.body.id },
    { $set: { travelerComplete: true, status: 'Completed' } }
  )
  res.status(200).json({ status: true })
}

const updateTransactionDetails = async (req, res) => {
  const trip = await Trip.findById(req.body.id)
  ;(trip.tipAmount = req.body.tipAmount),
    (trip.tipAdded = req.body.tipAdded),
    (trip.insuranceAmount = req.body.insuranceAmount),
    (trip.insuranceAdded = req.body.insuranceAdded),
    (trip.totalCost = req.body.totalCost),
    (trip.parcelCost = req.body.parcelCost)
  await trip.save()
  res.status(200).json({ trip })
}
const completeSenderTransaction = async (req, res) => {
  const trip = await Trip.findById(req.body.id)
  const user = await User.findById(req.user._id)
  if (trip.complete) {
    user.balance += Number(req.body.earning)
    user.amountMade += Number(req.body.earning)
    await user.save()
    res.status(200).json({
      status: true,
      user,
      trip
    })
  } else {
    res.status(200).json({
      status: true,
      message: 'Transaction is not yet marked complete by sender',
      trip
    })
  }
}
// const connectTraveler = async (req, res) => {
//   const trip = await Trip.findById(req.body.tripId)
//   const traveler = await User.findOne({ username: req.body.username })

//   trip.requestStatus = 'requested'
//   await trip.save()

//   const senderMail = req.user.email

//   let headers = req.headers.host
//   await user.notifications.push({
//     id: req.body.id,
//     text: `${req.body.username} has connected with you, respond by accepting or rejecting`
//   })

//   sendEmail(senderMail, req.user.username, headers, null, 'connectSender')
//   sendEmail(user.email, req.body.username, headers, null, 'connectTraveler')
//   await user.save()
//   await trip.save()
//   res.status(200).json({ message: 'Connection successful', user, trip })
// }

const sendConnect = async (req, res) => {
  const trip = await Trip.findById(req.body.tripId)
  let sender = await User.findById(req.user._id)
  let traveler = await User.findById(req.body.travelerId)

  const message = req.body.message

  trip.requestStatus = 'requested'
  await trip.save()

  await traveler.notifications.push({
    sender: sender._id,
    username: sender.username,
    notify: `${sender.username} has a pending request for you, respond or reject by accepting`,
    message,
    tripId: req.body.tripId,
    amount: req.body.amount
  })

  sendConnectEmail(
    '',
    '',
    sender.username,
    traveler.username,
    traveler.email,
    traveler.phone,
    '',
    message
  )
  await traveler.save()
}

const respondAction = async (req, res) => {
  const traveler = await User.findById(req.user._id)
  const sender = await User.findById(req.body.senderId)
  const trip = await Trip.findById(req.body.tripId)
  const action = req.body.action

  if (req.body.senderId !== null || req.body.senderId == undefined) {
    try {
      //Since the traveler is logged in, get Id from req.user
      //Pick the senderId from the action/comp and name it senderId before sending to the back
      //For Clarity
      if (action === 'accept') {
        const transaction = new Transaction({
          user: req.user._id,
          status: 'In Process',
          traveler: traveler.username,
          sender: sender.username,
          date: Date.now(),
          tripId: trip._id,
          tripCode: trip.secretCode,
          amountDue: req.body.amount
        })
        await transaction.save()

        const tripKey = trip.secretCode
        const senderKey = tripKey.substring(0, 4)
        const travelerKey = tripKey.substring(4, 8)
        trip.requestStatus = 'accepted'

        await trip.save()
        const code = new RedeemCode({
          userId: req.body.senderId,
          amount: req.body.amount,
          code: tripKey
        })
        await code.save()
        //Traveler accepts transaction, send a notification to sender
        //with acceptance notice and secret passcode
        //Also send a mail to traveler with secret passcode only and sender details.

        await senderMail(
          sender.email,
          sender.phone,
          sender.username,
          traveler.username,
          traveler.email,
          traveler.phone,
          senderKey,
          ''
        )
        await travelerMail(
          sender.email,
          sender.phone,
          sender.username,
          traveler.username,
          traveler.email,
          traveler.phone,
          travelerKey,
          ''
        )
      } else if (action === 'decline') {
        trip.requestStatus = 'listed'
        await trip.save()
        //If Traveler declines transaction, send a mail to sender with rejection notice
        // Do not send any mail to traveler, there is no need for that
        await rejectMail(
          sender.email,
          sender.phone,
          sender.username,
          traveler.username,
          '',
          '',
          '',
          ''
        )
      }

      res.status(200).json({ status: true, message: 'message sent' })
    } catch (error) {
      console.log('Process failed: ', error)
    }
  } else {
    res.status(400).json({ error: 'sender Id is null' })
  }
}
const redeemCode = async (req, res) => {
  const traveler = await User.findById(req.user._id)
  const code = await RedeemCode.findOne({ code: req.body.code })
  if(!code){
    res.status(400).json({ error: 'redeem code has been used or invalid'})
  } else {
    console.log(traveler._id)
    traveler.balance += code.amount
    await RedeemCode.deleteOne({ code: req.body.code })
    await traveler.save()
    res.status(200).json({ status: true, message: `Your balance has been credited with $${code.amount}`})
  }

}
const addTip = async (req, res) => {
  const traveler = await User.findOne({ email: req.body.email })
  const sender = await User.findById(req.user._id)
  if(sender.balance >= req.body.amount) {
    traveler.balance += req.body.amount
    sender.balance -= req.body.amount
    await traveler.save()
    await sender.save()
    res.status(200).json({ status: true, message: 'Tip succesfully added'})
  } else {
    res.status(400).json({ status: true, message: 'insufficient balance'})
  }
}
const payInsurance = async(req, res) => {
  const user = await User.findById(req.user._id)
  const parcelItem = req.body.item || 'parcel'
  await axios({
    method: 'post',
    url: URL,
    data: qs.stringify({
        client_id: process.env.INSURANCE_CLIENT_ID,
        api_key: process.env.INSURANCE_KEY,
        customer_name: `${user.firstname} ${user.lastname}`,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        items_ordered: parcelItem,
        currency: "USD",
        subtotal: req.body.total,
        coverage_amount: req.body.amount,
        order_number: uuid()
    }),
    headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    }
}).then(response => {
       res.status(200).json({ data: response.data})
    })
    .catch(err => {
      res.status(400).json({ message: 'transaction failed', err})
      console.log(err)
    })
}
module.exports = {
  postTransaction,
  fetchTransactions,
  fetchMyTransactions,
  completeSenderTransaction,
  completeTravelerTransaction,
  updateTransactionDetails,
  respondAction,
  sendConnect,
  redeemCode,
  addTip,
  payInsurance
}
