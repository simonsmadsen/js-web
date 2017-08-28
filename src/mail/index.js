import template from '../template'
import config from './../config'

const nodemailer = require('nodemailer')

const smtpConfig = {
  host: config.mail_host,
  port: config.mail_port,
  secure: config.mail_ssl === 'true',
  auth: {
    user: config.mail_user,
    pass: config.mail_password
  }
}

const transporter = nodemailer.createTransport(smtpConfig)
export function htmlMail(to, subject, html, data) {
  const mailOptions = {
    from: config.mail_from,
    to,
    subject,
    text: '',
    html: template(html)(data)
  }

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error)
    }
  })
}

export function plainMail(to, subject, text) {
  const mailOptions = {
    from: config.mail_from,
    to,
    subject,
    text,
    html: ''
  }

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error)
    }
  })
}
