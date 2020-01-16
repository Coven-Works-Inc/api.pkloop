const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const stripeChargeCallback = res => (stripeErr, stripeRes) => {
  if (stripeErr) {
    res.status(500).send({ error: stripeErr })
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
  // const body = {
  //   source: req.body.token.id,
  //   amount: req.body.amount,
  //   currency: 'usd'
  // }

  console.log('receiving stripe shit')

  // stripe.charges.create(req.body, stripeChargeCallback(res))
}
