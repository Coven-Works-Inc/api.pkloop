const { Schema, model } = require('mongoose')

const codeSchema = new Schema({
    amount: Number,
    code: String,
    traveler: String,
    sender: String
})

const Code = model('RedeemCode', codeSchema)
module.exports = Code