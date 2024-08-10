const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");
const authService = require("../services/authService");

class sendResetPasswordMail {
  async execute(email) {
    return authService.sendResetPasswordMail(email, userRepository);
  }
}

module.exports = new sendResetPasswordMail();
