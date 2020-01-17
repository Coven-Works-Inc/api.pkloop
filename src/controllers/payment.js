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
    source: req.body.source,
    amount: req.body.amount,
    currency: 'usd'
  }
  stripe.charges.create(body, stripeChargeCallback(res))
}
