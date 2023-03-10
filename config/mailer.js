const nodemailer = require('nodemailer');

require('dotenv').config()

const nodemailerConfig = {
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.EMAIL || 'leonard.gerlach89@ethereal.email',
    pass: process.env.EMAIL_PASSWORD || 'WtwazQqtePF7uMWnta'
  }
}

exports.mailerConfig = nodemailerConfig;

const GLOBAL_TRANSPORTER = nodemailer.createTransport(nodemailerConfig);

exports.GLOBAL_TRANSPORTER = GLOBAL_TRANSPORTER;