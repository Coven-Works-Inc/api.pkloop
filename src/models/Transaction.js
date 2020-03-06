const { Schema, model } = require('mongoose')

/**
 * =============================================================================
 * Model For Transaction
 * Returns an object document
 * Field sender : The ID of the the parcel sender (ObjectID)
 * Field Traveler : The ID of the parcel carrier (ObjectID)
 * Status: The status of transaction of type enum
 * Role: The role of a user in the transaction, could either be sender or traveler
 * date: Date Object
 * tripId: Id of the listed trip
 * amountDue: Amount to be give out to traveler after deduction of platform fees
 * tripCode: Secret code for trip confirmation
 * totalAmount: Totalamount before deduction of platform fees
 * ===============================================================================
 */

const transactionSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  traveler: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Accepted', 'Declined', 'Completed', 'Not Completed'],
    default: 'In Process'
  },
  Role: {
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
  TotalAmount: {
    type: Number,
    default: 0
  }
})

const Transaction = model('Transaction', transactionSchema)

module.exports = Transaction
