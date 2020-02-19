const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (email, firstname, token) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Login Success`,
    html: `
            Hello ${firstname}!, This is to notify you of a login on your account on pkloop.<br><br><br>
            Please do let us know if this attempt wasn't from you by reaching out immediately to contact@mypkloop.com.
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
