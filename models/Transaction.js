import { Schema, model } from 'mongoose'
const {
  Types: { ObjectId }
} = Schema

const Transactions = new Schema({
  traveller: {
    type: ObjectId,
    ref: 'User'
  },
  sender: {
    type: ObjectId,
    ref: 'User'
  },
  transId: {
    type: String,
    required: true
  },
  weight: {},
  amount: {
    type: String,
    required: true
  }
})

export default model('Transaction', Transactions)
