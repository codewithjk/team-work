class CreateMessage {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }
  async execute(message) {
    return await this.messageRepository.save(message);
  }
}

module.exports = CreateMessage;
