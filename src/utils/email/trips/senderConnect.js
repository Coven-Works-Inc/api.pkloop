const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (
  senderusername,
  senderemail,
  travelerusername,
  totalAmount
) => {
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: senderemail,
    subject: 'Trip Connected',
    html:  `
        Hello ${senderusername}, 
        <br />
        <br />
        This is to notify you that your request to  ${travelerusername} on the pkloop platform was successfully sent
        <br />
        We would let you know when they respond and the next line of action to take.
        $${Number(totalAmount).toFixed(2)} has been deducted from your wallet to cover the cost of this transaction.
        <br />
        Thanks
        <br />
        <br />
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
