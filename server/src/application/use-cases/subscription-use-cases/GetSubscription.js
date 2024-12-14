

class GetSubscription {
  constructor(subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async execute(query) {
    return await this.subscriptionRepository.findOne(query);
  }
}

module.exports = GetSubscription;
