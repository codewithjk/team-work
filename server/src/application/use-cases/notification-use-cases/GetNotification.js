class GetNotification {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(notificationId) {
    return await this.notificationRepository.findById(notificationId);
  }
}

module.exports = GetNotification;
