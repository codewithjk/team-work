class UpdateNotification {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(id, notification) {
    return this.notificationRepository.update(id, notification);
  }
}

module.exports = UpdateNotification;
