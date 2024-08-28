const Project = require("../../../domain/entities/Project");

class GetProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId) {
    return await this.projectRepository.findById(projectId);
  }
}

module.exports = GetProject;
