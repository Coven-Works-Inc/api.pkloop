const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (
  senderusername,
  travelerusername,
  traveleremail,
  tipAmount
) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: traveleremail,
    subject:   `Additional tip from ${senderusername}`,
    html: `
         Hello ${travelerusername}, ${senderusername} just sent you an additional tip of $${tipAmount}.
         Check your dashboard to view your new balance`
  }

  try {
    await sgMail.send(emailData)

    return 'mail sending success'
  } catch {
    return 'mail sending failure'
  }

  
}

module.exports = sendMail
