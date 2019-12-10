const Trip = require('../models/Trip')
const User = require('../models/User')

const { validateTrip } = require('../validators/trips')

exports.fetchTrips = async (req, res, next) => {
  const trips = await Trip.find()
    .select('location stopover destination')
    .exec()
  if (!trips) {
    return res
      .status(404)
      .json({ status: 'false', message: 'No available trips' })
  }

  res.status(200).json({ status: true, message: 'success', data: trips })
}

exports.postTrips = async (req, res, next) => {
  const { error } = await validateTrip(req.body)

  const location = req.body.location
  const destination = req.body.destination
  const arrivalDate = req.body.arrivalDate
  const stopOver1 = req.body.stopOver1
  const stopOver2 = req.body.stopOver2
  const stopOver3 = req.body.stopOver3
  const stopOver4 = req.body.stopOver4
  const parcelSize = req.body.parcelSize
  const parcelWeight = req.body.parcelWeight
  const transport = req.body.transport
  const additionalInfo = req.body.additionalInfo

  let stopOvers = [];

  stopOvers.push(stopOver1);
  stopOvers.push(stopOver2);
  stopOvers.push(stopOver3);
  stopOvers.push(stopOver4);

  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(400).json({
      status: false,
      message: "You can't post a trip until you are logged in"
    })
  }

  const trip = new Trip({
    location,
    destination,
    arrivalDate,
    stopOvers,
    parcelSize,
    parcelWeight,
    transport,
    additionalInfo
  })

  await trip.save()

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
