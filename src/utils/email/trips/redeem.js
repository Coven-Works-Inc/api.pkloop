const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (
  senderusername,
  travelerusername,
  traveleremail,
  amount
) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: traveleremail,
    subject: 'Congratulations',
    html:  `
        Hello ${travelerusername}, 
        <br />
        <br />
        This is to notify you that your transaction with ${senderusername} on the pkloop platform is complete.
        <br />
        Your account has been credited with ${amount}
        <br />
        Thanks for trusting us.
        <br />

        `
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
