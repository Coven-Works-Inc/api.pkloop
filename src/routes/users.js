const express = require('express')
const userRouter = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const userController = require('../controllers/user')

const {
  fetchAllUsers,
  fetchUser,
  updateProfilePicture,
  updateMyBalance,
  reduceMyBalance
} = userController

userRouter.get('/', fetchAllUsers)
userRouter.get('/fetchUser', auth, fetchUser)
userRouter.patch('/updateMe', auth, userController.updateUser)
userRouter.post('/updatePicture', updateProfilePicture)
userRouter.put('/updateMyBalance', auth, updateMyBalance)
userRouter.put('/reduceMyBalance', auth, reduceMyBalance)

module.exports = userRouter
