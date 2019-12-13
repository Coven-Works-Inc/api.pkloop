const express = require('express')
const winston = require('winston')

const bodyParser = require('body-parser')

require('dotenv').config()

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const http = require('http')
setInterval(function () {
  http.get('http://pkloop.herokuapp.com')
}, 300000) // every 5 minutes (300000)

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')
require('./startup/validation')()
require('./startup/prod')(app)

const port = process.env.PORT || 8000

const server = app.listen(port, () =>
  console.log(`App is listening on port ${port}`)
)

module.exports = server
