const userService = require("../services/userService");
const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");

class CreateUser {
  async execute(data) {
    return userService.createUser(data, userRepository);
  }
}

module.exports = new CreateUser();
