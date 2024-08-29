const authService = require("../services/authService");
const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");

class resendCode {
  async execute(data) {
    return authService.resendCode(data, userRepository);
  }
}

module.exports = new resendCode();
