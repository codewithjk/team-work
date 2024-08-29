const Project = require("../../../domain/entities/Project");

class UpdateProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id, project) {
    return this.projectRepository.update(id, project);
  }
}

module.exports = UpdateProject;
