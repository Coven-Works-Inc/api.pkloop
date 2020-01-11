const express = require('express')
const userRouter = express.Router()

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const userController = require('../controllers/user')

userRouter.get('/', userController.fetchAllUsers)
userRouter.patch('/updateUser',auth, userController.updateUser)
userRouter.post('/updatePicture', auth, userController.updateProfilePicture)

module.exports = userRouter
