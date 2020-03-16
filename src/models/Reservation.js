const { Schema, model } = require('mongoose')

const reserveSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    locationCity: {
      type: String,
      required: true
    },
    locationCountry: {
      type: String,
      required: true
    },
    destinationCity: {
      type: String,
      required: true
    },
    destinationCountry: {
      type: String,
      required: true
    },
    date: {
      type: Date
    }
  },
  { timestamps: true }
)

const Reserve = model('Reserve', reserveSchema)

module.exports = Reserve
