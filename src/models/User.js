const jwt = require('jsonwebtoken')
const config = require('config')
const { Schema, model } = require('mongoose')
const { isEmail } = require('validator')

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Please enter a firstname'],
      minlength: 2,
      maxlength: 50
    },
    lastname: {
      type: String,
      required: [true, 'Please enter a lastname'],
      minlength: 2,
      maxlength: 50
    },
    username: {
      type: String,
      unique: true,
      required: [true, 'Please enter a valid username'],
      minlength: 2,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
      validator: [isEmail, 'please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Please enter a valid phone number'],
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

const User = model('User', userSchema)

exports.User = User
