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
userRouter.get('/fetchUser', auth, fetchAllUsers)
userRouter.patch('/updateUser', auth, updateUser)
userRouter.post('/updatePicture', auth, updateProfilePicture)
userRouter.put('/updateMyBalance', auth, updateMyBalance)
userRouter.put('/reduceMyBalance', auth, reduceMyBalance)

module.exports = userRouter
