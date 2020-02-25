const { Schema, model } = require('mongoose')

const transactionSchema = new Schema({
  user: {
    type: String
  }, 
  sender: {
    type: String,
  },
  traveler: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Accepted', 'Declined', 'Completed', 'Not Completed', 'Pending'],
  },
  role: {
    type: String,
    enum: ['Sender', 'Traveler']
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
