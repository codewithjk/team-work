class NotifyUser {
  constructor(userNotificationRepository) {
    this.userNotificationRepository = userNotificationRepository;
  }

  async execute(userIds, notificationId) {
    const userNotifications = userIds.map((userId) => ({
      user: userId,
      notification: notificationId,
    }));
    return await this.userNotificationRepository.save(userNotifications);
  }
}

module.exports = NotifyUser;
