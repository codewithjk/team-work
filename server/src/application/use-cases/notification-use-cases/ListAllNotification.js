class ListAllNotification {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(query) {
    return this.notificationRepository.findAll(query);
  }
}

module.exports = ListAllNotification;
