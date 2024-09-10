class UpdateModule {
  constructor(moduleRepository) {
    this.moduleRepository = moduleRepository;
  }

  async execute(id, module) {
    console.log(id, module);
    return this.moduleRepository.update(id, module);
  }
}

module.exports = UpdateModule;
