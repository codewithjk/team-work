class UpdateSubscription {
  constructor(subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async execute(query, subscription, options) {
    console.log(query, subscription, options);
    return this.subscriptionRepository.update(query, subscription, options);
  }
}

module.exports = UpdateSubscription;
