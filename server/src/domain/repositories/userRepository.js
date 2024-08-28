class UserRepository {
  async findByEmail(email) {
    throw new Error("Method not implemented");
  }
  async findById(id) {
    throw new Error("Method not implemented");
  }
  async save(user) {
    throw new Error("Method not implemented");
  }
  async findByToken(code) {
    throw new Error("Method not implemented");
  }

  async findByVerificationToken(code) {
    throw new Error("Method not implemented");
  }
  async findByResetPsswordToken(token) {
    throw new Error("Method not implemented");
  }
}

module.exports = UserRepository;
