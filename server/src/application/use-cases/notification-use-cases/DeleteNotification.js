class DeleteNotification {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(id) {
    return await this.notificationRepository.delete(id);
  }
}

module.exports = DeleteNotification;
