const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");

class updateProfile {
  async execute(id, data) {
    let res = userRepository.findByIdAndUpdate(id, data);
    console.log(res);
    return res

  }
}

module.exports = new updateProfile();
