class DeleteSubscription {
  constructor(subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async execute(id) {
    return await this.subscriptionRepository.delete(id);
  }
}

module.exports = DeleteSubscription;
