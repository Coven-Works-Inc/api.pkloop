const User = require('../models/User')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const stripeChargeCallback = res => (stripeErr, stripeRes) => {
  if (stripeErr) {
    res.status(400).send({ error: stripeErr })
  } else {
    res.status(200).send({ success: stripeRes })
  }
}

exports.getpay = (req, res) => {
  res.send({
    message: 'Hello Stripe checkout server!',
    timestamp: new Date().toISOString()
  })
}

exports.postpay = (req, res) => {
  const body = {
    description: req.body.description,
    source: req.body.source,
    amount: req.body.amount,
    currency: 'usd'
  }
  stripe.charges.create(body, stripeChargeCallback(res))
}

exports.connectUser = async (req, res) => {
  const user = await User.findById(req.user._id)
  stripe.oauth.token({
    grant_type: 'authorization_code',
    code: req.body.code,
    assert_capabilities: ['transfers'],
  }).then(function(response) {
    user.stripeUserId = response.stripe_user_id;
    user.save()
    console.log(response.stripe_user_id)
  });
}
exports.payUser = async (req, res) => {
  const user = await User.findById(req.user._id)
  stripe.transfers.create(
    {
      amount: Number(req.body.amount) * 100,
      currency: 'usd',
      destination: req.body.destination,
    },
    async function(err, transfer) {
      user.balance = user.balance - Number(req.body.amount)
      user.amountMade = user.amountMade + Number(req.body.amount)
      await user.save()
      res.status(200).json({ transfer, status: true })
     console.log(transfer, err)
    }
  );
}
exports.getStripeId = async(req, res) => {
  const user =  await User.findById(req.user._id)
  if(user.stripeUserId){
    const stripeId = user.stripeUserId
    res.status(200).json({ status: true, stripeId })
  } else {
    res.status(400).json({ err: 'Stripe not connected to user'})
  }
}