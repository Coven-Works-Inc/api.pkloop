const Support = require('../models/Support')
const User = require('../models/User')
const crypto = require('crypto')
const { sendMail } = require('../utils/email/support')

const postSupport = async (req, res) => {
  const ticketId = crypto.randomBytes(6).toString('hex')
  const userId = req.user._id
  const subject = req.body.subject
  const message = req.body.message
  const user = await User.findById(userId)
  let email = user.email

  const support = new Support({
    user: userId,
    subject: subject,
    ticketId: '#' + ticketId,
    message: message,
    status: 'Open'
  })
  await support.save()

  await sendMail(email, subject, message)

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
