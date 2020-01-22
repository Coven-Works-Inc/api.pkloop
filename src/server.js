const express = require('express')
const passport = require('passport')
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')

require('dotenv').config()

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'))

const http = require('http')
setInterval(function () {
  http.get('http://pkloop-api.herokuapp.com')
}, 300000) // every 5 minutes (300000)

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')
require('./startup/validation')()
require('./startup/prod')(app)
require('./services/passport')

//monitoring request rates here
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 64 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
})

//Using the rate middleware to protect the api from multiple requests
app.use(/^api/, limiter)

const PORT = process.env.PORT || 8000

app.get(process.env.callbackURL, passport.authenticate('google'))

const server = app.listen(PORT, () =>
  console.log(`App is listening on port ${PORT}`)
)

module.exports = server
