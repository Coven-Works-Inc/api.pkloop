const express = require('express')
const userRouter = express.Router()

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const authController = require('../controllers/auth')

userRouter.post('/signup', authController.signup)
userRouter.post('/verify', authController.verify)
userRouter.post('/resend', authController.resendToken)
userRouter.post('/login', authController.login)
userRouter.post('/reset', authController.resetpassword)
userRouter.post('/password', authController.newpassword)
userRouter.post('/update', auth, authController.updatePassword)

module.exports = userRouter
