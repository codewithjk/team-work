const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");
const authService = require("../services/authService");

class VerifyUser {
  async execute(code) {
    return authService.verifyUser(code, userRepository);
  }
}

module.exports = new VerifyUser();
