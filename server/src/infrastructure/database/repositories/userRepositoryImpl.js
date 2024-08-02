const User = require("../models/userModel");
const UserRepository = require("../../../domain/repositories/userRepository");

class UserRepositoryImpl extends UserRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async save(user) {
    const newUser = new User(user);
    return newUser.save();
  }
}

module.exports = new UserRepositoryImpl();
