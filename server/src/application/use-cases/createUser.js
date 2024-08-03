const authService = require("../services/authService");
const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");

class CreateUser {
  async execute(data) {
    return authService.createUser(data, userRepository);
  }
}

module.exports = new CreateUser();
