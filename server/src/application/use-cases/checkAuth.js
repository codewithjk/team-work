const authService = require("../services/authService");
const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");

class checkAuth {
  async execute(id) {
    return authService.checkAuth(id, userRepository);
  }
}

module.exports = new checkAuth();
