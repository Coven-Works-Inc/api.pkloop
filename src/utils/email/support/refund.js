const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (sender, amount) => {
  const emailData = {
    from: 'PKLOOP SYSTEM',
    to: process.env.EMAIL_FROM,
    subject: 'Refund',
    html: `${sender} wil be receiving a refund of ${amount} to their wallet. Please ensure to complete within 1 - 5 days`
  }

  try {
    await sgMail.send(emailData)

    return 'mail sending success'
  } catch {
    return 'mail sending failure'
  }
}

module.exports = sendMail
