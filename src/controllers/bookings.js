const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.getCheckoutSession = async (req, res) => {
  stripe.checkout.session.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/travelers`,
    customer_email: req.user.email,
    client_reference_id: ''
  })
}
