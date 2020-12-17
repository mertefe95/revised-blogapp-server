const nodemailer =  require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid')
require('dotenv').config({
  path: `${__dirname}/../.env`
});


const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY
  })
)

const sendForgotPassword = (user, forgotT) => {
  const url = `http://localhost:3000/change-password/${forgotT}`

  transport.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: `<${user.email}`,
    subject: "Forgot password email",
    html: `Please click the link to change your password. <a href=${url}> ${url} </a>` 
  })
}

const sendActivatedEmail = (user) => {
  const url = `https://localhost:3000/login`

  transport.sendMail({
    from: process.env.EMAIL,
    to: `<${user.email}`,
    subject: "Your email has been activated",
    html: `Your email has been activated. You may proceed to our webpage and continue to login. <a href=${url}> ${url}</a>`
  })
}

const sendVerificationEmail = (user) => {
  const url = `http://localhost:3000/${user.activationKey}`

  transport.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: `<${user.email}>`,
    subject: "Verification Email",
    html: `Please click the link to verify your email. <a href=${url}> ${url}</a>`
  })
}

module.exports = {
  sendVerificationEmail,
  sendActivatedEmail,
  sendForgotPassword
}