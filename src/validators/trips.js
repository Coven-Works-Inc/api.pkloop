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
      .regex(/^[a-zA-Z0-9]$/)
      .optional(),
    stopOver2: Joi.string()
      .regex(/^[a-zA-Z0-9]$/)
      .optional(),
    stopOver3: Joi.string()
      .regex(/^[a-zA-Z0-9]$/)
      .optional(),
    stopOver4: Joi.string()
      .regex(/^[a-zA-Z0-9]r$/)
      .optional(),
    parcelSize: Joi.string().required(),
    parcelWeight: Joi.string().required(),
    transport: Joi.string()
      .max(255)
      .required(),
    additionalInfo: Joi.string().max(255)
  }

  return Joi.validate(trip, schema)
}

module.exports = {
  validateTrip
}
