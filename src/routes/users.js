const express = require('express')
const userRouter = express.Router()

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const userController = require('../controllers/user')

userRouter.get('/', userController.fetchAllUsers)

module.exports = userRouter
