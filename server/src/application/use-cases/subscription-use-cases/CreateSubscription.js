class CreateSubscription {
  constructor(subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async execute(subscription) {
    return await this.subscriptionRepository.save(subscription);
  }
}

module.exports = CreateSubscription;
