const { Schema, model } = require('mongoose');

const supportSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    subject: {
        type: String, 
        required: [true, 'Enter a subject']
    },
    text: {
        type: String,
        required: [true, 'Enter text for support']
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    date: {
        type: Date,
        default: Date.now()
    }
})
const Support = model('Support', supportSchema)

module.exports = Support