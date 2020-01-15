const express = require('express')
const supportRouter = express.Router()

const supportController = require('../controllers/support')
const auth = require('../middleware/auth')

supportRouter.post('/submit', auth, supportController.postSupport)
supportRouter.get('/fetchSupport', auth, supportController.fetchSupport)

module.exports = supportRouter
