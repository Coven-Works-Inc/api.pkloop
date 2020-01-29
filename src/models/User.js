const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')
const { Schema, model } = require('mongoose')
const { isEmail } = require('validator')
const gravatar = require('gravatar')

const chatSchema = new Schema({
  text: String,
  sender: String,
  dateSent: Date,
  isOwn: Boolean
})
const senderSchema = new Schema({
  username: String,
  id: String,
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  country: String
})

const travelerSchema = new Schema({
  username: String,
  id: String,
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  country: String
})
const notificationsSchema = new Schema({
  user: String,
  text: String
})
const userSchema = new Schema({
  UserId: {
    type: String,
    default: this._id
  },
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
    // required: true, Because of oauth
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
    type: String,
    default: gravatar.url(this.email, {
      s: '200', // Size
      r: 'pg', // Rating
      d: 'mm' // Default
    })
  },
  status: {
    type: Number,
    default: 0
  },
  street: {
    type: String,
    default: false
  },
  city: {
    type: String,
    default: false
  },
  state: {
    type: String,
    default: false
  },
  country: {
    type: String,
    default: 'United States'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  token: {
    type: String
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Ratings must be between 1 and 5'],
    max: [5, 'Ratings must be between 1 and 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  resetToken: String,
  resetTokenExpiration: Date,
  balance: {
    type: Number,
    default: 0
  },
  amountMade: {
    type: String,
    default: 0
  },
  referralCount: {
    type: Number,
    default: 0
  },
  passwordChangedAt: {
    type: Date
  },
  chat: [chatSchema],
  traveler: [travelerSchema],
  sender: [senderSchema],
  notifications: [notificationsSchema]
})

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
      balance: this.balance,
      photo: this.photo,
      username: this.username
    },
    config.get('jwtPrivateKey'),
    { expiresIn: 3600 }
  )
}

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )

    return JWTTimeStamp < changedTimeStamp //True means changed, false means not chnaged
  }

  return false
}

const User = model('User', userSchema)

module.exports = User
