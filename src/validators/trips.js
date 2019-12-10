const Joi = require('joi')

function validateTrip (trip) {
  const schema = {
    location: Joi.string()
      .min(2)
      .max(50)
      .required(),
    destination: Joi.string()
      .min(2)
      .max(50)
      .required(),
    arrivalDate: Joi.date().required(),
    stopOver1: Joi.string()
      .min(5)
      .max(255),
    stopOver2: Joi.string()
      .min(5)
      .max(255),
    stopOver3: Joi.string()
      .min(5)
      .max(255),
    stopOver4: Joi.string()
      .min(5)
      .max(255),
    parcelSize: Joi.string().required(),
    parcelWeight: Joi.string().required(),
    transport: Joi.string()
      .min(5)
      .max(255)
      .required(),
    additionalInfo: Joi.string()
      .min(5)
      .max(255)
      .required()
  }

  return Joi.validate(trip, schema)
}

module.exports = {
  validateTrip
}
