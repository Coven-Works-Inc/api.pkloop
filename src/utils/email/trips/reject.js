const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (
  senderemail,
  senderphone,
  senderusername,
  travelerusername,
  traveleremail,
  travelerphone,
  code,
  message,
  amount
) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: senderemail,
    subject: 'Package Request update',
    html: `
        Hello ${senderusername}, your Send package request made on the pkloop platform has been declined by the traveler. Please Login to review further steps necessary to complete your request .
        Your escrow wallet has been funded with $${amount} to be used for other transactions.`
  }

  try {
    await sgMail.send(emailData)

    return 'mail sending success'
  } catch {
    return 'mail sending failure'
  }

  // sgMail
  //   .send(emailData)
  //   .then(sent => {
  //     return res.json({
  //       message: `An email has been sent to ${email}, please follow the instructions to activate`
  //     })
  //   })
  //   .catch(err => {
  //     //console.log(`Email Sent Error: ${err}`)
  //     return res.json({
  //       message: err.message
  //     })
  //   })
}

module.exports = sendMail
