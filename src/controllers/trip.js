const Trip = require('../models/Trip')
const User = require('../models/User')

const { validateTrip } = require('../validators/trips')

exports.fetchTrips = async (req, res, next) => {
  const trips = await Trip.find()
    .populate('user', 'photo')
    .exec()

  // .select('user location stopover destination')
  // .exec()
  if (!trips) {
    return res
      .status(404)
      .json({ status: 'false', message: 'No available trips' })
  }

  res.status(200).json({ status: true, message: 'success', data: trips })
}

exports.postTrips = async (req, res, next) => {
  // const { error } = await validateTrip(req.body)
  // if (error) {
  //   return res.status(400).json({ status: false, message: 'Validation Error' })
  // }

  const locationCity = req.body.locationCity
  const locationCountry = req.body.locationCountry
  const destinationCity = req.body.destinationCity
  const destinationCountry = req.body.destinationCountry
  const arrivalDate = req.body.arrivalDate
  const stopOver1 = req.body.stopOver1
  const stopOver2 = req.body.stopOver2
  const stopOver3 = req.body.stopOver3
  const stopOver4 = req.body.stopOver4
  const parcelSize = req.body.parcelSize
  const parcelWeight = req.body.parcelWeight
  const transport = req.body.transport
  const additionalInfo = req.body.additionalInfo

  let stopOvers = []

  // for (let i = 1; i < 4; i++) {
  //   if ('stopOver' + i !== '') {
  //     console.log(typeof ('stopOver' + i))
  //     stopOvers.push(('stopOver' + i).value)
  //   }
  // }

  // console.log(stopOvers)
  stopOvers.push(stopOver1)
  stopOvers.push(stopOver2)
  stopOvers.push(stopOver3)
  stopOvers.push(stopOver4)

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