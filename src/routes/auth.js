const express = require('express')

const auth = require('../middleware/auth')
const authController = require('../controllers/auth')
const authRouter = express.Router()

const passport = require('passport')

authRouter.post('/verify', authController.verify)
authRouter.post('/signup', authController.signup)
authRouter.post('/verify', authController.verify)
authRouter.post('/resend', authController.resendToken)
authRouter.post('/login', authController.login)
authRouter.post('/reset', authController.resetpassword)
authRouter.post('/password/:token', authController.newpassword)
// authRouter.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email']
//   })
// )
authRouter.get('/google', authController.googleauth)
authRouter.get('/google/callback', authController.googleCallBack)
authRouter.post('/update', auth, authController.updatePassword)

module.exports = authRouter
