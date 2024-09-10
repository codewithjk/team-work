class DeleteModule {
  constructor(moduleRepository) {
    this.moduleRepository = moduleRepository;
  }

  async execute(id) {
    return await this.moduleRepository.delete(id);
  }
}

module.exports = DeleteModule;
