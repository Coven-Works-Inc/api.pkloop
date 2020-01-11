const express = require('express')
const userRouter = express.Router()

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const userController = require('../controllers/user')

const {
  fetchAllUsers,
  updateUser,
  updateProfilePicture,
  updateMyBalance,
  reduceMyBalance
} = userController

userRouter.get('/', fetchAllUsers)
userRouter.patch('/updateUser', auth, updateUser)
userRouter.post('/updatePicture', auth, updateProfilePicture)
userRouter.post('/updateMyBalance', auth, updateMyBalance)
userRouter.post('/reduceMyBalance', auth, reduceMyBalance)

module.exports = userRouter
