/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import '@babel/polyfill'

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import errorHandler from 'errorhandler'
import Debug from 'debug'
import dotenv from 'dotenv'
import morgan from 'morgan'
import swaggerUI from 'swagger-ui-express'

import routes from './routes'
import swaggerDoc from './config/swagger.json'

// Configure mongoose's promise to global promise
mongoose.promise = global.Promise

// .env configuration with dotenv
dotenv.config()
const { NODE_ENV, DB_DEV, DB_PROD, PORT } = process.env

console.log(DB_DEV)

// Setup debug
const debug = Debug('airfree:server')

// Configure isProduction variable
const isProduction = NODE_ENV === 'production'

// Initiate our app
const app = express()

// Configure our app
app.use(cors())
app.use(morgan('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

if (!isProduction) {
  app.use(errorHandler())
}

// Configure Mongoose
mongoose
  .connect(
    isProduction ? DB_PROD : DB_DEV,
    {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 10,
      bufferMaxEntries: 0,
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => debug('DB Connected'))
  .catch(err => {
    debug(err)
    debug('DB Connection Failed')
  })

mongoose.set('debug', true)

// Routes
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDoc))
app.use('/api/v1/', routes)
app.use('/*', (req, res) =>
  res.status(404).send({
    data: null,
    message: 'Incorrect Route',
    error: true
  })
)

app.use((err, req, res, next) => {
  debug(err.stack)
  return res.status(500).send({
    data: null,
    message: err.message,
    error: true
  })
})

const port = PORT || 3000
app.listen(port, () => debug(`Server running on port ${port}`))
