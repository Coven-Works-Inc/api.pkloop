const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (email, firstname) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Password reset`,
    html: `
            <p>Hello ${firstname}, <br/> Your password was updated successfully on our platform. If you did not request for a password update, Please contact Pkloop support immediately.</p>
        `
  }

  try {
    await sgMail.send(emailData)

    return 'mail sending success'
  } catch {
    return 'mail sending failure'
  }
}

module.exports = sendMail
