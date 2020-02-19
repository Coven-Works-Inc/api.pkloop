const User = require('../models/User')
const crypto = require('crypto')
const Token = require('../models/Token')
const _ = require('lodash')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const { OAuth2Client } = require('google-auth-library')
const passport = require('passport')
const signUp = require('../utils/email/auth/signup')
const sendLogin = require('../utils/email/auth/login')
const sendReset = require('../utils/email/auth/reset')
const client = new OAuth2Client(process.env.clientID)

require('dotenv').config()

const { validateUser, validateLogin } = require('../validators/user')
const { sendEmail } = require('../utils/email')

/** @route    POST /api/user/register
 * @desc     registers a user to the database if all the required information is sent.
 * @access   Public - can be accessed by anyone
 */
exports.signup = async (req, res) => {
  const { error } = validateUser(req.body)
  if (error) {
    return res
      .status(400)
      .send({ status: false, message: error.details[0].message })
  }

  if (req.body.password != req.body.confirmpassword) {
    return res.json({ status: false, message: 'Passwords do not match!' })
  }

  let user = await User.findOne({ email: req.body.email })
  if (user) {
    return res
      .status(400)
      .send({ status: false, message: 'Email already exists!' })
  }

  user = await User.findOne({ username: req.body.username })
  if (user) {
    return res
      .status(400)
      .send({ status: false, message: 'Username unavailable!' })
  }

  let phone = await User.findOne({ phone: req.body.phone })
  if (phone) {
    return res.status(400).send({
      status: false,
      message: 'The phone number you entered is already registered with us.'
    })
  }

  const avatar = gravatar.url(req.body.email, {
    s: '200', // Size
    r: 'pg', // Rating
    d: 'mm' // Default
  })

  user = new User(req.body)

  // res.json({user})

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  user.referralID = crypto.randomBytes(3).toString('hex')

  user = await user.save()

  if (req.query.refId) {
    const ref = await User.findOne({ referralID: req.query.refId })

    ref.referralCount += 1

    await ref.save()
  }

  // Create a verification token for this user
  let token = await Token.create({
    _userId: user._id,
    key: crypto.randomBytes(3).toString('hex')
  })

  await signUp(user.email, user.firstname, token.key)

  res.status(200).send({
    status: true,
    data: user,
    message: 'A verification email has been sent to ' + user.email + '.'
  })
}

exports.verify = async (req, res) => {
  const token = await Token.findOne({ key: req.body.token })
  if (!token) {
    return res.status(400).send({ status: false, message: 'Invalid Token' })
  }

  // If we found a token, find a matching user
  const user = await User.findOne({ _id: token._userId })
  if (!user) {
    return res
      .status(400)
      .send({ status: false, message: 'No user with this token.' })
  }

  if (user.isVerified) {
    return res
      .status(400)
      .send({ status: false, message: 'Account has already been verified.' })
  }

  user.isVerified = true
  user.status = 1

  await token.deleteOne({})

  // Else the next step; Verify and save the user
  const usertoken = user.generateAuthToken()

  user.token = usertoken

  await user.save()

  // We can also redirect here once a token has been generated for the user
  res
    .status(200)
    .json({ status: true, message: 'User verification sucessful!' })
}

exports.resendToken = async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(400).send({
      status: false,
      message: 'We were unable to find a user with that email.'
    })
  }

  if (user.isVerified) {
    return res.status(400).json({
      status: false,
      message: 'This account has already been verified. Please log in.'
    })
  }

  // Create a verification token for this user
  const token = new Token({
    _userId: user._id,
    key: crypto.randomBytes(3).toString('hex')
  })

  // Save the verification token
  await token.save()

  let headers = req.headers.host

  await signUp(user.email, user.firstname, token.key)

  res.status(200).json({
    status: true,
    message: 'A new verification email has been sent to ' + user.email + '.'
  })
}

// @route    POST /api/user/login
// @desc     logs in a user to the app if information is verified
// @access   Public - can be accessed by anyone to login
exports.login = async (req, res, next) => {
  const { error } = validateLogin(req.body)
  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message })
  }

  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user)
      return res
        .status(400)
        .json({ status: false, message: 'Invalid username or password' })

    const { password, isVerified } = user

    const pass = await bcrypt.compare(req.body.password, password)
    if (!pass)
      return res
        .status(400)
        .json({ status: false, message: 'Invalid username or password' })

    if (!isVerified)
      return res
        .status(400)
        .json({ status: false, message: 'Please verify your account first' })

    const token = user.generateAuthToken()

    user.token = token

    await sendLogin(user.email, user.firstname)

    await user.save()

    res
      .status(200)
      .header('x-auth-token', token)
      .json({
        data: _.pick(user, [
          '_id',
          'firstname',
          'lastname',
          'email',
          'balance',
          'token',
          'photo',
          'notifications'
        ]),
        message: 'log in successful, redirecting...'
      })
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error logging in' })
  }
}

exports.resetpassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(200).json({
        status: true,
        message: 'No user with this account was found.'
      })
    }

    const token = crypto.randomBytes(3).toString('hex')

    user.resendToken = token
    user.resetTokenExpiration = Date.now() + 3600000

    await user.save()

    sendReset(user.email, user.firstname, token)

    res.status(200).json({
      status: true,
      message:
        'We are sending instructions to reset your password. If you do not receive an email, check your spam folder!'
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'Operation Failed, please try again!'
    })
  }
}

exports.newpassword = async (req, res, next) => {
  const token = req.params.token
  const newpassword = req.body.password

  let resetUser

  resetUser = await User.findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now()
    }
  })
  if (!resetUser)
    return res.status(200).json({
      status: false,
      message: 'This token is no longer valid.'
    })

  /*
   * Checking if the supplied password and the former one which was forgotten by the user are the same
   */
  bcrypt.compare(newpassword, resetUser.password)
  if (userpassword)
    return res.status(200).json({
      status: false,
      message: 'Your old password and new password cannot be the same!'
    })

  const salt = await bcrypt.genSalt(10)
  resetUser.password = await bcrypt.hash(newpassword, salt)

  resetUser.resetToken = undefined
  resetUser.resetTokenExpiration = undefined

  await resetUser.save()

  res.status(200).json({
    status: true,
    message: 'Password successfully changed.'
  })
}

exports.updatePassword = async (req, res) => {
  const userId = req.user._id
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword

  const user = await User.findById(userId)

  const userpassword = await bcrypt.compare(oldPassword, user.password)
  if (!userpassword)
    return res.status(400).json({
      status: false,
      message: 'The value for your old password is incorrect'
    })

  const passwordCheck = await bcrypt.compare(user.password, newPassword)

  let response

  if (oldPassword === newPassword || passwordCheck == true) {
    response = 'Your old and new passwords cannot be the same'
    res.status(400).json({ status: true, message: response })
  } else {
    response = 'Password Update succesful'

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)

    await user.save()

    let headers = req.headers.host

    await sendUpdate(user.email, user.firstname)

    res.status(200).json({ status: true, message: response })
  }
}

exports.googleLogin = (req, res) => {
  const { idToken } = req.body

  client
    .verifyIdToken({ idToken, audience: process.env.clientID })
    .then(async response => {
      //console.log('Google Login Response', response)
      const { email_verified, name, email } = response.payload

      if (email_verified) {
        try {
          const user = await User.findOne({ email: email })
          if (!user) return res.status(404).json({ message: 'User not found!' })
          const token = user.generateAuthToken()
          user.token = token
          await user.save()

          return res
            .status(200)
            .header('x-auth-token', token)
            .json({
              data: _.pick(user, [
                '_id',
                'firstname',
                'lastname',
                'email',
                'balance',
                'token',
                'photo'
              ]),
              message: 'log in successful, redirecting...'
            })
        } catch (error) {
          res
            .status(500)
            .json({ status: false, message: 'Error logging in with google' })
        }
      }
    })
}

exports.facebookLogin = async (req, res) => {
  const { userID, accessToken } = req.body

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`

  try {
    const response = await axios.get(url)
    const { email, name } = response

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const token = user.generateAuthToken()
    user.token = token
    await user.save()

    return res
      .status(200)
      .header('x-auth-token', token)
      .json({
        data: _.pick(user, [
          '_id',
          'firstname',
          'lastname',
          'email',
          'balance',
          'token',
          'photo'
        ]),
        message: 'log in successful, redirecting...'
      })
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: 'Error logging in with facebook' })
  }
}
