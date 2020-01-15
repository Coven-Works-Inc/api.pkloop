const { Schema, model } = require('mongoose')

const supportSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    subject: {
      type: String,
      required: [true, 'Enter a subject']
    },
    ticketId: {
      type: String
    },
    message: {
      type: String,
      required: [true, 'Message is required']
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open'
    }
  },
  { timestamps: true }
)
const Support = model('Support', supportSchema)

module.exports = Support
