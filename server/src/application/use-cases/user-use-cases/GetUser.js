class GetUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(query) {
    return await this.userRepository.find(query);
  }
}

module.exports = GetUser;
