class GetSubscription {
  constructor(subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async execute(subscriptionId) {
    return await this.subscriptionRepository.findById(subscriptionId);
  }
}

module.exports = GetSubscription;
