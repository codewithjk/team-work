const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");
const authService = require("../services/authService");

class updatePassword {
  async execute(password, token) {
    return authService.updatePassword(password, token, userRepository);
  }
}

module.exports = new updatePassword();
