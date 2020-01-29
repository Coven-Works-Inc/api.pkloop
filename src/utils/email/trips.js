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
  message,
  template
) => {
  let emailData
  switch (template) {
    case 'senderAccept':
      emailData = {
        from: process.env.EMAIL_FROM,
        to: senderemail,
        subject: `Request Update`,
        html: `
            Hello ${senderusername}, your request to ${travelerusername} on the pkloop platform was just accepted. You can reach the traveler via email or phone to decide on meeting point and other necessary details.

            Traveler Email: ${traveleremail}
            Traveler Phone: ${travelerphone}

            Also, your secret code for this transaction is 458, ensure this is only given to the traveler upon receipt by the receiver of your parcel. 

            Please ensure to keep with all the instructions on the pkloop platform to ensure safe delivery of your parcel.

            The gods be with you.
        `
      }
    case 'travelerAccept':
      emailData = {
        from: process.env.EMAIL_FROM,
        to: senderemail,
        subject: `Request Update`,
        html: `
            Hello ${travelerusername}, Thank you for accepting to help us carry a parcel. Here are some contact details you may be needing for your client.

            Client Email: ${senderemail}
            Client Phone: ${senderphone}

            Also, your secret code for this transaction is 065, ensure to obtain the last three digist of this code from the receiver of the parcel upon delivery. Use this to redeem your payment on pkloop. 

            Please ensure to keep with all the instructions on the pkloop platform to ensure safe delivery of your parcel.

            The gods be with you.
        `
      }
    case 'senderReject':
      emailData = {
        from: process.env.EMAIL_FROM,
        to: senderemail,
        subject: `Request Notification`,
        html: `
            Hello ${senderusername},Your traveler request to traveler ${travelerusername} on the pkloop platform has been rejected.

            Please log in to the pkloop platform to make another request
        `
      }
    case 'sendTrans':
      emailData = {
        from: process.env.EMAIL_FROM,
        to: traveleremail,
        subject: `Will you carry my parcel?`,
        html: message
      }
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
