class ListAllMessage {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }
  async execute(query) {
    return this.messageRepository.findAll(query);
  }
}

module.exports = ListAllMessage;
