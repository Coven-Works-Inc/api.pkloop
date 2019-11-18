const error = require('../middleware/error')
const users = require('../routes/users')
const transactions = require('../routes/transactions')
const express = require('express')
const cors = require('cors')

module.exports = function (app) {
  app.use(cors())
  app.use(express.json())
  app.use(error)
  app.use('/api/users', users)
  app.use('/api/transactions', transactions)
  app.all('*', (req, res, next) => {
    res.status(404).json({
      status: 'fail',
      message: `Can't find the url '${req.originalUrl}' on the server`
    })
  })
}
