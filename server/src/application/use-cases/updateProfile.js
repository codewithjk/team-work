const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");

class updateProfile {
  async execute(id, data) {
    return userRepository.findByIdAndUpdate(id, data);


  }
}

module.exports = new updateProfile();
