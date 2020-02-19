const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (sender, subject, message) => {
  const emailData = {
    from: sender,
    to: process.env.EMAIL_FROM,
    subject: subject,
    html: message
  }

  try {
    await sgMail.send(emailData)

    return 'mail sending success'
  } catch {
    return 'mail sending failure'
  }
}

module.exports = sendMail
