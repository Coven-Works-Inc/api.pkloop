const Parcel = require('../models/Parcel')
const transaction = require('../models/Transaction')
const crypto = require('crypto')
const User = require('../models/User')

exports.sendParcel = async (req, res) => {
  const name = req.body.name
  const weight = req.body.weight
  const desc = req.body.description

  try {
    let user = await User.findById(req.user._id)

    let transaction = new transaction()
  } catch (error) {}
}
