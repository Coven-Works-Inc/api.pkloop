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
