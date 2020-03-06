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
  tip
) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: traveleremail,
    subject: 'New Sender Request: Transport package',
    html: tip ?  `
        Hello ${travelerusername}, 
        <br />
        <br />
        This is to notify you that ${senderusername} made a delivery request to you on the mypkloop.com platform. You have 24 hours to login to accept or reject
        <br />
        Also, ${senderusername} is offering you a TIP of $${tip}
        <br />
        <br />
        <a href="https://mypkloop.com/dashboard/transactions" style="color: white; background:blue; width: 100px;  outline: none; border: 1px solid blue; padding: 10px; text-decoration: none;">Accept</a>
        <a href="https://mypkloop.com/dashboard/transactions" style="color: red; background: white; width: 100px; outline: none; padding: 10px; border: 1px solid red; text-decoration: none;">Reject</a>
        <br />
        `
        : 
        `
        Hello ${travelerusername}, 
        <br />
        <br />
        This is to notify you that ${senderusername} made a delivery request to you on the mypkloop.com platform. You have 24 hours to login to accept or reject
        <br />
        <a href="https://mypkloop.com/dashboard/transactions" style="color: white; background:blue; width: 100px;  outline: none; border: 1px solid blue; padding: 10px; text-decoration: none;">Accept</a>
        <a href="https://mypkloop.com/dashboard/transactions" style="color: red; background: white; width: 100px; outline: none; padding: 10px; border: 1px solid red; text-decoration: none;">Reject</a>
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
