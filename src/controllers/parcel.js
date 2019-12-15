const Parcel = require('../models/Parcel')
const transaction = require('../models/Transaction')
const crypto = require('crypto')
const User = require('../models/User')

exports.sendParcel = async (req, res) => {
  try {
    const parcel = await Parcel.create(req.body)

    res.status(200).json({ status: true, data: { parcel } })
  } catch (error) {
    res.status(400).json({ status: false, message: 'Error, please try' })
  }
}
