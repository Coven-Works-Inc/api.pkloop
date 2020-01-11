const User = require('../models/User')
const cloudinary = require('cloudinary')
const catchAsync = require('../utils/catchAsync')
require('dotenv').config

cloudinary.config = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
}

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
// exports.updateUser = async (req, res) => {
//   const user = await User.findById(req.user._id)
//   if (!user) {
//     return res.status(404).json({ status: true, message: 'No users found' })
//   } else {
//     if (
//       req.body.email &&
//       req.body.firstname &&
//       req.body.lastname &&
//       req.body.phone
//     ) {
//       user.email = req.body.email
//       user.firstname = req.body.firstname
//       user.lastname = req.body.lastname
//       user.phone = req.body.phone
//       user.photo = req.body.photo

//       await user.save()
//       return res.status(200).json({
//         status: true,
//         data: user
//       })
//     }
//   }
// }

const filterReq = (obj, ...allowedFields) => {
  const passedObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) passedObj[el] = obj[el]
  })

  return passedObj
}

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
    'photo'
  )

  const user = await User.findByIdAndUpdate(req.user._id, filteredObj, {
    new: true,
    runValidators: true
  })

  res
    .status(200)
    .json({ status: true, data: user, message: 'Update successful' })
})

exports.updateProfilePicture = async (req, res) => {
  const user = await User.findById(req.user._id)
  const path = Object.values(Object.values(req.files)[0])[0].path
  if (!user)
    return res.status(404).json({ message: 'Please login to continue' })
  await cloudinary.uploader.upload(path).then(async photo => {
    user.photo = photo
    await user.save()
    return res.status(200).json({
      status: true,
      message: 'image successfully uploaded',
      data: user
    })
  })
}

exports.updateMyBalance = catchAsync(async (req, res) => {
  const balance = parseInt(req.body.balance)
  const user = await User.findById(req.user._id)

  user.balance = user.balance + balance

  await user.save()

  res.status(200).json({ status: true, message: 'Balance updated successfully', data: user.balance});
})

exports.reduceMyBalance = catchAsync(async (req, res) => {
  const balance = parseInt(req.body.balance)
  const user = await User.findById(req.user.id)

  user.balance = user.balance - balance

  await user.save()

  res.status(200).json({status: true, message: 'Balance updated successfully', data: user.balance});
})
