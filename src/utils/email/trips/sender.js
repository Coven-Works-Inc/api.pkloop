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
  message
) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: senderemail,
    subject: 'Request update',
    html: `
        Hello ${senderusername}, 
        <br />
        <br />
        This is to notify you that your request to ${travelerusername} on the pkloop platform was just accepted. You can reach the traveler via email or phone to decide on meeting point and other necessary details.
        <br />
        <br />
            Traveler Email: ${traveleremail}
            Traveler Phone: ${travelerphone}
        <br />
        <br />
      Also, your secret code for this transaction is [${code}], ensure this is only given to the traveler upon receipt by the receiver of your parcel.
        <br />
        <br />
      Please ensure to keep with all the instructions on the pkloop platform to ensure safe delivery of your parcel.

      The gods be with you.`
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
