const { Schema, model } = require('mongoose')

const codeSchema = new Schema({
    amount: Number,
    code: String,
    userId: String
})

const Code = model('RedeemCode', codeSchema)
module.exports = Code