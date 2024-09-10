class CreateModule {
  constructor(moduleRepository) {
    this.moduleRepository = moduleRepository;
  }

  async execute(module) {
    return await this.moduleRepository.save(module);
  }
}

module.exports = CreateModule;
