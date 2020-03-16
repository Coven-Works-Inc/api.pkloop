const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (
  email,
  locationCity,
  locationCountry,
  destinationCity,
  destinationCountry
) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Update on your reservation`,
    html: `Hello, 
            This is to notify you that there is a traveler for moving from ${locationCity}, ${locationCountry} to ${destinationCity}, ${destinationCountry}. You made a reservation earlier for this route. You can log on to the mypkloop platform to connect with the traveler and get your parcel delivered.

            <br /> 
            <br />
             Click <a href="https://mypkloop.com" style="text-decoration: none;">here</a> to log on to the platform.
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
