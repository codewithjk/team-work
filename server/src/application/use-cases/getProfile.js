const authService = require("../services/authService");
const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");

class getProfile {
  async execute(id) {
    return authService.getProfile(id, userRepository);
  }
}

module.exports = new getProfile();
