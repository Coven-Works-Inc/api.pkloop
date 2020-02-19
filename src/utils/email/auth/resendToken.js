const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (email, firstname) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Token Resend Token`,
    html: `<p>Hello ${name}, <br/> Someone requested a password reset for your account, if that was you, Click the link below to reset your password, else ignore this message. <br/> <a href="http://mypkloop.com/password/${token}">link</a> to set a new password.</p>`
  }

  try {
    await sgMail.send(emailData)

    return 'mail sending success'
  } catch {
    return 'mail sending failure'
  }
}

module.exports = sendMail
