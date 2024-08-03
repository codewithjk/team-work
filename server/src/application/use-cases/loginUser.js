const authService = require("../services/authService");
const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");

class loginUser {
  async execute(data) {
    return authService.loginUser(data, userRepository);
  }
}

module.exports = new loginUser();
