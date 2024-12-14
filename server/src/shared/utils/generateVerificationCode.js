const crypto = require("crypto");

function generateVerificationCode(length = 6) {
  // Generate a random string of the specified length
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length)
    .toUpperCase();
}

module.exports = generateVerificationCode;
