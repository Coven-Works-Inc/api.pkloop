const winston = require('winston');

module.exports = function(err, req, res, next){

    winston.log('error', err.message); //this or //winston.error(err.message, err)

    res.status(500).send("Server Error!");
}