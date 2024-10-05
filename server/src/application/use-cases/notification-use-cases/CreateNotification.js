class CreateNotification {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(notification) {
    return await this.notificationRepository.save(notification);
  }
}

module.exports = CreateNotification;
