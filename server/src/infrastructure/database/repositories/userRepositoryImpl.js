const User = require("../models/userModel");
const UserRepository = require("../../../domain/repositories/userRepository");

class UserRepositoryImpl extends UserRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }
  async findById(id) {
    return User.findOne({ _id: id });
  }
  async findByVerificationToken(code) {
    return User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
  }
  async findByResetPsswordToken(token) {
    return User.findOne({
      resetPsswordToken: token,
      resetPsswordTokenExpiresAt: { $gt: Date.now() },
    });
  }

  async save(user) {
    const newUser = new User(user);
    return newUser.save();
  }
}

module.exports = new UserRepositoryImpl();
