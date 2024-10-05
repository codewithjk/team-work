class ClearAllNotification {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(userId) {
    return await this.notificationRepository.clearAll(userId);
  }
}

module.exports = ClearAllNotification;
