var nodemailer = require('nodemailer') //importing node mailer

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jephtino@gmail.com', //replace with your email
    pass: 'character94' //replace with your password
  }
})

const sendMail = (sender, subject, message) => {
  var mailOptions = {
    from: sender, //replace with your email
    to: 'jephtino@gmail.com', //replace with your email
    subject: subject,
    html: `${message}`
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

module.exports = { sendMail }
