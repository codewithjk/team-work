class DeleteMessage {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  async execute(id) {
    return await this.messageRepository.delete(id);
  }
}

module.exports = DeleteMessage;
