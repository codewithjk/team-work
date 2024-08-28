const authService = require("../services/authService");
const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");

class CreateUser {
  constructor(userRepository, emailService, tokenService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.tokenService = tokenService;
  }
  async execute(data) {
    return authService.createUser(data, userRepository);
  }
}

module.exports = new CreateUser();
