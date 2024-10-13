class ListAllSubscription {
  constructor(subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async execute(query) {
    return this.subscriptionRepository.findAll(query);
  }
}

module.exports = ListAllSubscription;
