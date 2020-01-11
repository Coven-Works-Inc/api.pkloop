const User = require('../models/User')

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
exports.updateUser = async (req, res) => {
  const user = await User.findById(req.user._id)
  if(!user){
    return res.status(404).json({ status: true, message: 'No users found'})
  } else {
    if(req.body.email && req.body.firstname && req.body.lastname && req.body.phone){
      user.email = req.body.email
      user.firstname = req.body.firstname
      user.lastname = req.body.lastname
      user.phone = req.body.phone
      user.photo = req.body.photo
  
      await user.save()
      return res.status(200).json({
        status: true, 
        data: user
      })
    }
  }
  
}