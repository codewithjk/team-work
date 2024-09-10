class GetModule {
  constructor(moduleRepository) {
    this.moduleRepository = moduleRepository;
  }

  async execute(moduleId) {
    return await this.moduleRepository.findById(moduleId);
  }
}

module.exports = GetModule;
