const Support = require('../models/Support')
const User = require('../models/User')

const postSupport = async(req, res) => {
    const user = await User.findById(req.user._id)

    const support = new Support({
        user: user.id,
        subject: req.body.subject,
        text: req.body.status,
        date: Date.now()
    })
    await support.save()

    res.status(200).json({status: true, data: support})
}

const fetchSupport = async (req, res, next) => {
    let support = await Support.find({ user: req.user._id })
  
    let message
  
    if (support.length === 0) {
      support = []
      message = 'No support ticket found'
    } else {
        message = `Found ${support.length} support tickets`
    }
  
    return res.status(200).json({ status: true, support, message })
  }

module.exports = {
    postSupport,
    fetchSupport
}