class UpdateModule {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }
  async execute(id, message) {
    return this.messageRepository.update(id, message);
  }
}

module.exports = UpdateModule;
