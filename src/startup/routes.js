const express = require('express')
const cors = require('cors')
const error = require('../middleware/error')
const users = require('../routes/users')
const transactions = require('../routes/transactions')
const trips = require('../routes/trip')
const parcel = require('../routes/parcel')
const auth = require('../routes/auth')
const payments = require('../routes/payment')
const support = require('../routes/support')
const chat = require('../routes/chat')
const { CLIENT_ORIGIN } = require('../../config/config')
const AppError = require('../utils/appError')
// const globalErrorHandler = require('../middleware/errorHandler')
const formData = require('express-form-data')
const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(cors())
  app.use(express.json())
  app.use(error)
  app.use(formData.parse())
  app.use('/api/users', users)
  app.use('/api/auth', auth)
  app.use('/api/transactions', transactions)
  app.use('/api/trips', trips)
  app.use('/api/payments', payments)
  app.use('/api/chat', chat)
  app.use('/api/parcel', parcel)
  app.use('/api/support', support)
  app.use('/chat', 
          proxy({
            target: 'http://localhost:4000'
          }))
  // app.all('*', (req, res, next) => {
  //   next(
  //     new AppError(`Can't find the url ${req.originalUrl} on the server`, 404)
  //   )
  // })
  // app.use(globalErrorHandler)
}
