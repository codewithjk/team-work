class UpdateSubscription {
  constructor(subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async execute(id, subscription) {
    console.log(id, subscription);
    return this.subscriptionRepository.update(id, subscription);
  }
}

module.exports = UpdateSubscription;
