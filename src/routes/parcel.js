const express = require('express')
const parcelRouter = express.Router()
const auth = require('../middleware/auth')
const parcelController = reuqire('../controllers/parcel.js')

parcelRouter.post('/parcel', auth, parcelController.sendParcel)

module.exports = parcelRouter
