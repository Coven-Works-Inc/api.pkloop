var nodemailer = require('nodemailer') //importing node mailer

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jephtino@mypkloop.com', //replace with your email
    pass: 'Character94@' //replace with your password
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
      res.send('error') // if error occurs send error as response to client
    } else {
      console.log('Email sent: ' + info.response)
      res.send('Sent Successfully') //if mail is sent successfully send Sent successfully as response
    }
  })
}

module.exports = { sendMail }
