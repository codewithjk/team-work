class GetMessage {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  async execute(messageId) {
    return await this.messageRepository.findById(messageId);
  }
}

module.exports = GetMessage;
