class ListAllUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(query) {
    return this.userRepository.findAll(query);
  }
}

module.exports = ListAllUser;
