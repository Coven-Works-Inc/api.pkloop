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
    subject: 'Will you carry my parcel?',
    html: tip ?  `
        Hello ${travelerusername}, 
        <br />
        <br />
        This is to notify you that ${senderusername} made a request to you on the pkloop platform, you can log on to accept or reject
        <br />
        Also, ${senderusername} is offering you an additional tip of $${tip}
        <br />
        <br />
        <a href="http://localhost:3000/#/dashboard/transactions" style="color: white; background:blue; width: 100px;  outline: none; border: 1px solid blue; padding: 10px; text-decoration: none;">Accept</a>
        <a href="http://localhost:3000/#/dashboard/transactions" style="color: red; background: white; width: 100px; outline: none; padding: 10px; border: 1px solid red; text-decoration: none;">Reject</a>
        <br />
        `
        : 
        `
        Hello ${travelerusername}, 
        <br />
        <br />
        This is to notify you that ${senderusername} made a request to you on the pkloop platform, you can log on to accept or reject
        <br />
        <a href="http://localhost:3000/#/dashboard/transactions" style="color: white; background:blue; width: 100px;  outline: none; border: 1px solid blue; padding: 10px; text-decoration: none;">Accept</a>
        <a href="http://localhost:3000/#/dashboard/transactions" style="color: red; background: white; width: 100px; outline: none; padding: 10px; border: 1px solid red; text-decoration: none;">Reject</a>
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
