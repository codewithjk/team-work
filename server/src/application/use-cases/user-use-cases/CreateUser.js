class CreateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute(user) {
    return await this.userRepository.save(user);
  }
}

module.exports = CreateUser;
