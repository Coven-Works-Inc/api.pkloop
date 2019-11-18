const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  key: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token
