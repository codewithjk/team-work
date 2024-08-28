const Project = require("../../../domain/entities/Project");

class DeleteProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id) {
    return await this.projectRepository.delete(id);
  }
}

module.exports = DeleteProject;
