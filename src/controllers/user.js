const User = require('../models/User')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('firstname lastname username email ') //Selecting just the username and email of the users and displaying
      .exec()
    if (!users)
      return res
        .status(404)
        .json({ status: 'true', message: 'No Users found!' })

    res.status(200).json({
      status: true,
      message: `Found ${users.length} users`,
      data: users
    })
  } catch (error) {
    res.status(500).json({ status: true, message: `Operation failed` })
  }
}

const filterReq = (obj, ...allowedFields) => {
  const passedObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) passedObj[el] = obj[el]
  })

  return passedObj
}

exports.fetchUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)

  res.status(200).json({ status: true, data: user })
})

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "You can't modify password here. Use the correct route to do that."
      )
    )
  }

  const filteredObj = filterReq(
    req.body,
    'email',
    'firstname',
    'lastname',
    'phone',
    'photo',
    'street',
    'city',
    'state'
  )

  const user = await User.findByIdAndUpdate(req.user._id, filteredObj, {
    new: true,
    runValidators: true
  })

  res
    .status(200)
    .json({ status: true, data: user, message: 'Update successful' })
})

exports.updateMyBalance = catchAsync(async (req, res) => {
  const amount = parseInt(req.body.amount)
  const user = await User.findById(req.user._id)

  user.balance = user.balance + amount

  await user.save()

  res.status(200).json({
    status: true,
    message: 'Balance updated successfully',
    data: user.balance
  })
})

exports.reduceMyBalance = catchAsync(async (req, res) => {
  const amount = parseInt(req.body.amount)
  const user = await User.findById(req.user._id)
  if (user.balance >= amount) {
    user.balance = user.balance - amount

    await user.save()

    res.status(200).json({
      status: true,
      message: 'Balance updated successfully',
      data: user.balance
    })
  } else {
    res.status(400).json({
      message: 'Insufficient balance',
      data: user.balance
    })
  }
})
