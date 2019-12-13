const express = require('express')
const userRouter = express.Router()

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

module.exports = userRouter
