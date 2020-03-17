const Trip = require('../models/Trip')
const User = require('../models/User')
const Reservation = require('../models/Reservation')

const reservationMail = require('../utils/email/trips/reservation')

exports.fetchTrips = async (req, res, next) => {
  const trips = await Trip.find()
    .populate('user', 'photo')
    .exec()
  if (!trips) {
    return res
      .status(404)
      .json({ status: 'false', message: 'No available trips' })
  }

  res.status(200).json({ status: true, message: 'success', data: trips })
}

exports.postTrips = async (req, res, next) => {
  const {
    locationCity,
    locationCountry,
    destinationCity,
    destinationCountry,
    arrivalDate,
    stopOver1,
    stopOver2,
    stopOver3,
    stopOver4,
    parcelSize,
    parcelWeight,
    transport,
    additionalInfo
  } = req.body

  let stopOvers = []

  stopOvers.push(stopOver1, stopOver2, stopOver3, stopOver4)

  const reserved = await Reservation.find({
    $and: [
      { locationCity: locationCity },
      { locationCountry: locationCountry },
      { destinationCity: destinationCity },
      { destinationCountry: destinationCountry }
    ]
  })

  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(400).json({
      status: false,
      message: "You can't post a trip until you are logged in"
    })
  }

  const trip = new Trip({
    user: req.user._id,
    username: user.username,
    email: req.user.email,
    locationCity,
    locationCountry,
    destinationCity,
    destinationCountry,
    arrivalDate,
    stopOvers,
    parcelSize,
    parcelWeight,
    transport,
    additionalInfo
  })

  await trip.save()

  if(reserved){
    await reservationMail(
      reserved.email,
      locationCity,
      locationCountry,
      destinationCity,
      destinationCountry
    )
    console.log(reserved)
  }


  res.status(200).json({
    status: true,
    message:
      'You have successfully posted a trip, you will be contacted shortly by a sender'
  })
}

exports.updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(201).json({ status: false, message: 'updated', data: trip })
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'operation failed'
    })
  }
}

exports.cancelTrip = async (req, res, next) => {
  try {
    await Trip.findByIdAndDelete(req.params.id)
    res.status(201).json({ status: false, message: 'deleted' })
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'operation failed'
    })
  }
}

exports.fetchShippers = async (req, res, next) => {
  try {
    const shippers = await Trip.find({ transport: 'Ship' })

    res.status(200).json({ status: 'false', data: shippers })
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'operation failed'
    })
  }
}
exports.getTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id)
  res.status(200).json({ status: true, data: trip })
}
exports.addReceiver = async (req, res) => {
  const trip = await Trip.findById(req.body.id)
  const receiver = {
    fullname: req.body.fullname,
    address: req.body.address,
    phone: req.body.phone
  }
  trip.receiver = receiver
  await trip.save()
  res.status(200).json({ status: true, trip: trip })
}
exports.addEarning = async (req, res) => {
  const trip = await Trip.findById(req.body.id)
  const earning = req.body.earning
  trip.earning = earning
  await trip.save()
  res.status(200).json({ status: true, trip: trip })
}
exports.completeTrip = async (req, res) => {
  const trip = await Trip.findById(req.body.id)
  trip.complete = true
  await trip.save()
  res.status(200).json({ status: true, trip })
}

/**
 * @private
 * Reserve a Trip/ a Search for a Trip
 */

exports.reserve = async (req, res) => {
  await Reservation.create(req.body)

  res.status(200).json({ message: 'Successfully booked a trip ahead' })
}
