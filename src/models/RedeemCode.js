const { Schema, model } = require('mongoose')

const codeSchema = new Schema({
    amount: Number,
    code: String,
    traveler: String,
    sender: String,
    senderTrans: String,
    travelerTrans: String,
})

const Code = model('RedeemCode', codeSchema)
module.exports = Code