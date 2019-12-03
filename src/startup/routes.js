const express = require('express')
const cors = require('cors')
const error = require('../middleware/error')
const users = require('../routes/users')
const transactions = require('../routes/transactions')
const trips = require('../routes/trip')

module.exports = function (app) {
  // app.use(cors({ origin: '*' }))
  app.use(express.json())
  app.use(error)
  app.use('/api/users', users)
  app.use('/api/transactions', transactions)
  app.use('/api/trips', trips)
  app.all('*', (req, res, next) => {
    res.status(404).json({
      status: 'fail',
      message: `Can't find the url '${req.originalUrl}' on the server`
    })
  })
}
