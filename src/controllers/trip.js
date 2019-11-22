const Trip = require('../models/Trip')
const User = require('../models/User')

exports.fetchTrips = async (req, res, next) => {
  const trips = await Trip.find()
    .select('location stopover destination')
    .exec()
  if (!trips) {
    return res
      .status(404)
      .json({ status: 'false', message: 'No available trips' })
  }

  res.status(200).json({ status: true, message: 'success', data: users })
}

exports.postTrip = async (req, res, next) => {
  const location = req.body.location
  const date_of_departure = req.body.dod
  const date_of_arrival = req.body.doa
  const stop_over = req.body.stop_over
  const destination = req.body.destination

  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(400).json({
      status: false,
      message: "You can't post a trip until you are logged in"
    })
  }

  const trip = new Trip({
    location,
    date_of_departure,
    stop_over,
    destination,
    date_of_arrival
  })

  trip.save()

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
    await trip.findByIdAndDelete(req.params.id)
    res.status(201).json({ status: false, message: 'deleted' })
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'operation failed'
    })
  }
}
