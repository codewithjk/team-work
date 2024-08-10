const crypto = require("crypto");

function generateVerificationCode(length = 6) {
  // Generate a random string of the specified length
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // Convert to hexadecimal format
    .slice(0, length) // Return required number of characters
    .toUpperCase(); // Make it uppercase (optional)
}

module.exports = generateVerificationCode;
