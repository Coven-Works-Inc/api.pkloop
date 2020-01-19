const User = require('../models/User') 

exports.connectTravelers = async (req, res) => {
    const traveler = await User.findOne({ username: req.body.travelerUsername })
    const sender = await User.findOne({ username: req.body.senderUsername })
    const travelerData = {
        username: traveler.username,
        id: traveler.UserId,
        firstname: traveler.firstname,
        lastname: traveler.lastname,
        email: traveler.email,
        phone: traveler.phone,
        country: traveler.country
    }
    const senderData = {
        username: sender.username,
        id: sender.UserId,
        firstname: sender.firstname,
        lastname: sender.lastname,
        email: sender.email,
        phone: sender.phone,
        country: sender.country
    }
    sender.traveler.push(travelerData)
    traveler.sender.push(senderData)
    await traveler.save()
    await sender.save()
    res.status(200).json({
        sender,
        traveler
    })
}