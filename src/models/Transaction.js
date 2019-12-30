const { Schema, model } = require('mongoose')

const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  status: {
    type: String,
    enum: ['Pending', 'Declined', 'Completed'],
    default: 'Pending'
  },
  with: {
    type: String
  },
  role: {
    type: String,
    required: [true, 'Please enter user role in transaction']
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

const Transaction = model('Transaction', transactionSchema)

module.exports = Transaction
