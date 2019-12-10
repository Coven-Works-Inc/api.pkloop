const mongoose = require('mongoose')
const winston = require('winston')
const config = require('config')

module.exports = function () {
  let db
  if (process.env.NODE_ENV === 'development') {
    db = process.env.DATABASE
  } else {
    db = process.env.DATABASE
  }

  mongoose
    .connect(
      db,
      { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => winston.info(`Database connected to ${db}...`))
}
