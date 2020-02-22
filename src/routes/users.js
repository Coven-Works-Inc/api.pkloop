const express = require('express')
const userRouter = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const userController = require('../controllers/user')

const {
  fetchAllUsers,
  updateUser,
  fetchUser,
  uploadUserPhoto,
  updateMyBalance,
  reduceMyBalance,
  reduceEscrow
} = userController

userRouter.get('/', auth, fetchAllUsers)
userRouter.get('/fetchUser', auth, fetchUser)
userRouter.post('/updateMe', auth, updateUser)
userRouter.put('/updateMyBalance', auth, updateMyBalance)
userRouter.put('/reduceMyBalance', auth, reduceMyBalance)
userRouter.put('/reduceEscrow', auth, reduceEscrow)



module.exports = userRouter
