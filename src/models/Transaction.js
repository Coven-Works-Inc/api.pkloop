const { Schema, model } = require('mongoose')

const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Accepted', 'Declined', 'Completed'],
    default: 'In Process'
  },
  traveler: {
    type: String
  },
  sender: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  },
  tripId: {
    type: Schema.Types.ObjectId
  },
  amountDue: {
    type: Number,
    default: 0
  },
  tripCode: {
    type: String
  },
  amountPaid: {
    type: Number,
    default: 0
  }
})

const Transaction = model('Transaction', transactionSchema)

module.exports = Transaction
