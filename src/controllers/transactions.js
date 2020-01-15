const Transaction = require('../models/Transaction')
const User = require('../models/User')

const postTransaction = async (req, res, next) => {
  const user = await User.findById(req.user._id)

  const transaction = new Transaction({
    user: user.id,
    status: req.body.status,
    with: req.body.with,
    role: req.body.role
  })

  await transaction.save()

  res.status(200).json({ status: true, data: transaction })
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

module.exports = {
  postTransaction,
  fetchTransactions,
  fetchMyTransactions
}
