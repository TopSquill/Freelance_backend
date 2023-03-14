const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require("path");
const { nodemailerConfig, mailerConfig, GLOBAL_TRANSPORTER } = require('../../../config/mailer');
const { Common } = require('../../utils/constants/common');
const { generateOTP } = require('../../utils/function/user');

require('dotenv').config()

function sendVerificationMail(recipientMail, emailOtp) {
  // read the HTML template file
  const htmlTemplate = fs.readFileSync(path.resolve(__dirname, './template.html'), 'utf-8');

  const verificationLink = `${process.env.FRONTEND_SERVER_HOST}?verify=${emailOtp}`
  // compile the HTML template with EJS

  const compiledTemplate = ejs.compile(htmlTemplate)({ verificationLink });

  // create an email message object
  const mailOptions = {
    from: mailerConfig.auth.user,
    to: recipientMail,
    subject: `${Common.siteTitle} | OTP Verification`,
    html: compiledTemplate
  };
  console.log('mailOptions', mailOptions);
  // send the email
  GLOBAL_TRANSPORTER.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = sendVerificationMail;