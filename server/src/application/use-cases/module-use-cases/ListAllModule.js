class ListAllModule {
  constructor(moduleRepository) {
    this.moduleRepository = moduleRepository;
  }

  async execute(query) {
    return this.moduleRepository.findAll(query);
  }
}

module.exports = ListAllModule;
