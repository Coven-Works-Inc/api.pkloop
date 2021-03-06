const { createTransport } = require('nodemailer')
const { google } = require('googleapis')
const { moment } = require('moment')
const {
  auth: { OAuth2 }
} = google

require('dotenv').config()

const oauth2Client = new OAuth2(
  '711336590232-72nt474ppqa7fio4ui8l5fl11srj9ito.apps.googleusercontent.com',
  'aGDeAYT_9zvT9_r1IzZydZ61',
  'https://developers.google.com/oauthplayground'
)
oauth2Client.setCredentials({
  refresh_token:
    '1/IlwzDfZMcGAkFiHXzZLCuVq2OJLubUffs59Y93fz7eeD9y1C5wXthfWazVLxJRn6'
})

const accessToken = oauth2Client.getAccessToken()

const getEmailData = (to, name, headers, token, template) => {
  let data = null
  switch (template) {
    case 'welcome':
      data = {
        from: 'Pkloop<admin@pkloop.com>',
        to,
        subject: 'Welcome to Pkloop',
        html: `Welcome to PKLoop, the most efficient platform for parcel delivery. Click on the link to get started <a href="https://pkloop.herokuapp.com/verify?token=${token}" style="text-decoration: none;">Verify Me</a>`
      }
      break
    case 'reset':
      data = {
        from: 'PKloop<admin@pkloop.com>',
        to,
        subject: 'Password reset',
        html: `<p>Hello ${name}, <br/> Someone requested a password reset for your account, if that was you, Click the link below to reset your password, else ignore this message. <br/> <a href="https://mypkloop.com/password/${token}">link</a> to set a new password.</p>`
      }
      break
    case 'updatePassword':
      data = {
        from: 'PKLoop<jephtino@gmail.com>',
        to,
        subject: 'Password update',
        html: `<p>Hello ${name}, <br/> Your password was updated successfully on our platform. If you did not request for a password update, Please contact Pkloop support immediately.</p>`
      }
    case 'connectTraveler':
      data = {
        from: 'PKLoop<jephtino@gmail.com>',
        to,
        subject: 'New sender connected',
        html: `<p>Hello ${name}, <br /> A new sender has connected to you, login to your dashboard to accept or decline this request</p>`
      }
    case 'connectSender':
      data = {
        from: 'PKLoop<jephtino@gmail.com>',
        to,
        subject: 'New Traveler connected',
        html: `<p>Hello ${name}, <br />You've connected to a traveler, we will let you know when they respond to your request</p>`
      }
    case 'acceptSender':
      data = {
        from: 'PKLoop<jephtino@gmail.com>',
        to,
        subject: 'Transaction accepted',
        html: `<p>Hello ${name}, <br />Your transaction request is accepted</p>`
      }
    case 'acceptTraveler':
      data = {
        from: 'PKLoop<jephtino@gmail.com>',
        to,
        subject: 'Transaction accepted',
        html: `<p>Hello ${name}, <br />You've succesfully accepted this transaction</p>`
      }
    case 'declineSender':
      data = {
        from: 'PKLoop<jephtino@gmail.com>',
        to,
        subject: 'Pending request denied',
        html: `<p>Hello ${name}, <br />Your pending request has been declined</p>`
      }
    case 'declineTraveler':
      data = {
        from: 'PKLoop<jephtino@gmail.com>',
        to,
        subject: 'New Traveler connected',
        html: `<p>Hello ${name}, <br />You've declined this transaction</p>`
      }
    default:
      data
  }
  return data
}

{
  /* <p>Follow the link below to verify your account</p><p>http://${headers}/confirmation.</p> */
}

const sendEmail = (to, name, headers, token, type) => {
  const smtpTransport = createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'jephtino@gmail.com',
      clientId:
        '711336590232-72nt474ppqa7fio4ui8l5fl11srj9ito.apps.googleusercontent.com',
      clientSecret: 'aGDeAYT_9zvT9_r1IzZydZ61',
      refreshToken:
        '1/IlwzDfZMcGAkFiHXzZLCuVq2OJLubUffs59Y93fz7eeD9y1C5wXthfWazVLxJRn6',
      accessToken: accessToken
      // user: "jephtino@gmail.com",
      // pass: process.env.EMAIL_PASS
    }
  })

  const mail = getEmailData(to, name, headers, token, type)

  smtpTransport.sendMail(mail, function (error, response) {
    if (error) {
      console.log(error)
    } else {
      cb()
    }
    smtpTransport.close()
  })
}

module.exports = { sendEmail }
