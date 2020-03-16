const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (email, firstname, token) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Account activation link`,
    html: `
            Hello ${firstname}!, Welcome to PKLoop, the most efficient platform for parcel delivery. Click on the link to get started <a href="https://mypkloop.com/verify?token=${token}" style="text-decoration: none;">Verify Me</a>

            <br />
          <br />
          <br />
          
          <img src="../../images/Logo.png" alt="pkloop logo" />
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
