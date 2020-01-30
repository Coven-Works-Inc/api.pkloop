const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (
  senderemail,
  senderphone,
  senderusername,
  travelerusername,
  traveleremail,
  travelerphone,
  subject,
  message
) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: traveleremail,
    subject: 'Request Update',
    html: `
         Hello ${travelerusername}, Thank you for accepting to help ${senderusername}  carry a parcel.Here are some contact details you may be needing for your client.

            Client Email: ${senderemail}
          Client Phone: ${senderphone}

  Also, your secret code for this transaction is 065, ensure to obtain the last three digist of this code from the receiver of the parcel upon delivery.Use this to redeem your payment on pkloop.

  Please ensure to keep with all the instructions on the pkloop platform to ensure safe delivery of your parcel.`
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
