const express = require('express')
const parcelRouter = express.Router()
const auth = require('../middleware/auth')
const parcelController = require('../controllers/parcel.js')

parcelRouter.post('/', auth, parcelController.sendParcel)

module.exports = parcelRouter
