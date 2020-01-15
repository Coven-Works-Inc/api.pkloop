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
  let support = await Support.find({ user: req.user._id })

  let message

  if (support.length === 0) {
    support = []
    message = 'No support ticket found'
  } else {
    message = `Found ${support.length} support tickets`
  }

  return res.status(200).json({ status: true, support, message })
}

module.exports = {
  postSupport,
  fetchSupport
}
