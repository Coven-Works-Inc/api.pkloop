const sgMail = require('@sendgrid/mail')
const crypto = require('crypto')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const key = crypto.randomBytes(4).toString('hex')
const senderKey = key.substring(0, 4)
const travelerKey = key.substring(4, 8)

console.log(`Whole Key: ${key}`)
console.log(`sender: ${senderKey}, traveler: ${travelerKey}`)

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
    to: traveleremail,
    subject: 'Trip Details',
    html: `
         Hello ${travelerusername}, Thank you for accepting to help transport
         ${senderusername}'s package
         <br />
         <br />
         Please, find below the contact information you may need to facilitate this transaction.
        <br />
        <br />
        <b>${senderusername}'s</b> Mail: ${senderemail}<br/>
        <b>${senderusername}'s</b> Phone: ${senderphone}
         <br />
        <br />
  Also, your secret code for this transaction is <b>[${code}]</b>.
  <br />
  <br />
  Please, remember to obtain the first four digits of this code from the recipient upon delivery.
  <br/>
  <br />
  Enter the 8 digit code to confirm the package delivery and to redeem your payment on the pkloop platform.
         <br />
        <br />
        Please remember to follow PKLoop Trust and Safety guidelines and Terms insstructions on the mypkloop platform to ensure smooth and safe delivery of package.`
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
