const winston = require('winston')
//require('winston-mongodb'); Commented out because of a freeze when combined with jest

module.exports = function () {
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  )

  process.on('unhandledRejection', ex => {
    throw ex
  })

  winston.add(winston.transports.File, { filename: 'logfile.log' })
  // winston.add(winston.transports.MongoDB, {
  //   db: 'mongodb://localhost/vidly',
  //   level: 'info'
  // });
}
