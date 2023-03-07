const bcrypt = require("bcrypt");


async function encrypt(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const encryptedPassword = await bcrypt.hash(password, salt);
  return encryptedPassword;
}

exports.encrypt = encrypt;

// Function to generate OTP
function generateOTP(userId) {

  // Declare a digits variable
  // which stores all digits
  var digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let OTP = '';

  for (let i = 0; i < 32; i++ ) {
      OTP += digits[Math.floor(Math.random() * 62)];
  }
  return `${OTP}.${userId}`;
}

exports.generateOTP = generateOTP;

function getTimestamp() {
  const expiryInMilis = 60*60*1000; // 1hr expiry
  return Number(new Date()) + expiryInMilis;
}

exports.getTimestamp = getTimestamp;

function checkIfEmailOtpValid(actualUserToken, currentToken) {
  const userTokenSplit = actualUserToken.split('_');
  const actualToken = userTokenSplit[0]
  const timestamp = userTokenSplit[1];

  if (timestamp > Number(new Date()) || actualToken === currentToken) {
    return true;
  }

  return false
}

exports.checkIfEmailOtpValid = checkIfEmailOtpValid;

function parseEmailToken(emailToken) {
  const emailTokenSplit = emailToken.split('.');
  return { userId: emailTokenSplit[1], verifyToken: emailToken }
}

exports.parseEmailToken = parseEmailToken;