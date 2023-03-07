const nodemailer = require('nodemailer');

require('dotenv').config()

const nodemailerConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your_email_password'
  }
}

exports.mailerConfig = nodemailerConfig;

const GLOBAL_TRANSPORTER = nodemailer.createTransport(nodemailerConfig);

exports.GLOBAL_TRANSPORTER = GLOBAL_TRANSPORTER;