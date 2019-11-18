const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },
    lastname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    },
    localCurrency: {
      type: String,
      default: 'NGN'
    },
    referralID: {
      type: String,
      required: true
    },
    photo: {
      type: String
    },
    status: {
      type: Number,
      default: 0
    },
    country: {
      type: String,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    token: {
      type: String
    },
    resetToken: String,
    resetTokenExpiration: Date,
    balance: {
      type: Number,
      default: 0
    },
    referralCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

// We validate the user here and generate a token for the user
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      phone: this.phone,
      referralID: this.referralID,
      localCurrency: this.localCurrency,
      status: this.status,
      isVerified: this.isVerified,
      balance: this.balance
    },
    config.get('jwtPrivateKey'),
    { expiresIn: 3600 }
  )
}

const User = mongoose.model('User', userSchema)

module.exports = User
