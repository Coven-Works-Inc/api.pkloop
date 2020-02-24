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
  message
) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: senderemail,
    subject: 'Request update(Accepted)',
    html: `
        Hello ${senderusername}, 
        <br />
        <br />
        Congratulations.Your send package request to ${travelerusername} on the mypkloop platform was just accepted.
        You can now communicate with the traveler via email or phone to agree on a safe meeting place, exchage receiver info and discuss other necessary details to facilitate this transaction
        <br />
        <br />
            Traveler Email: ${traveleremail}
            Traveler Phone: ${travelerphone}
        <br />
        <br />
      Your secret code for this transaction is <b>[${code}]</b>, Your recipient should only disclose this code to the traveler after receiving your parcel.
        <br />
        <br />
      Please remember to follow PKLoop Trust and Safety guidelines and Terms insstructions on the mypkloop platform to ensure smooth and safe delivery of package`
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
