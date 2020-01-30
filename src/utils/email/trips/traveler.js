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
         Hello ${travelerusername}, Thank you for accepting to help 
         ${senderusername}  carry a parcel.
         <br />
         <br />
         Here are some contact details you may be needing for your client.
        <br />
        <br />
        <b>${senderusername}'s</b> Mail: ${senderemail}<br/>
        <b>${senderusername}'s</b> Phone: ${senderphone}
         <br />
        <br />
  Also, your secret code for this transaction is [${code}].
  <br />
  <br />
  Please, do ensure to obtain the last three digits of this code from the receiver of the parcel upon delivery.
  <br/>
  <br />
  Use this to redeem your payment on pkloop.
         <br />
        <br />
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
