const authService = require("../services/authService");
const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");

class oauthSignup {
  async execute(data) {
    return authService.oauthSignup(data, userRepository);
  }
}

module.exports = new oauthSignup();
