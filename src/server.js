const express = require('express')
const passport = require('passport')

const bodyParser = require('body-parser')

require('dotenv').config()

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

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

const PORT = process.env.PORT || 8000

app.get(process.env.callbackURL, passport.authenticate('google'))

const server = app.listen(PORT, () =>
  console.log(`App is listening on port ${PORT}`)
)

module.exports = server
