const { Schema, model } = require('mongoose')

const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  status: {
    type: String,
    enum: ['Pending', 'Declined', 'Completed', 'Accepted'],
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
  },
  tripId: {
    type: Schema.Types.ObjectId
  },
  senderComplete: {
    type: Boolean,
    default: false
  },
  travelerComplete: {
    type: Boolean,
    default: false
  },
  tipAdded: {
    type: Boolean,
    default: false
  },
  insuranceAdded: {
    type: Boolean,
    default: false
  },
  tipAmount : {
    type: Number,
    default: 0
  },
  insuranceAmount : {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
  parcelCost: {
    type: Number,
    default: 0
  }
})

const Transaction = model('Transaction', transactionSchema)

module.exports = Transaction
