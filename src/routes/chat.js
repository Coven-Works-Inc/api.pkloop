const express = require('express')
const chatRouter = express.Router()

const chatController = require('../controllers/chat')
const auth = require('../middleware/auth')

chatRouter.post('/', auth, chatController.connectTravelers)

module.exports = chatRouter
