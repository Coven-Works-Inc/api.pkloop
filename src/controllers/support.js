const Support = require('../models/Support')
const User = require('../models/User')
const crypto = require('crypto')

const postSupport = async (req, res) => {
  const ticketId = crypto.randomBytes(6).toString('hex')
  const userId = req.user._id

  const support = new Support({
    user: userId,
    subject: req.body.subject,
    ticketId: '#' + ticketId,
    message: req.body.message,
    status: 'Open'
  })
  await support.save()

  res.status(200).json({ status: true, message: 'Success', data: support })
}

const fetchSupport = async (req, res, next) => {
  let tickets = await Support.find({ user: req.user._id })

  let message

  if (tickets.length === 0) {
    tickets = []
    message = 'No support ticket found'
  } else {
    message = `Found ${tickets.length} support tickets`
  }

  return res.status(200).json({ status: true, tickets, message })
}

module.exports = {
  postSupport,
  fetchSupport
}
