class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute(id, user) {
    return this.userRepository.update(id, user);
  }
}

module.exports = UpdateUser;
