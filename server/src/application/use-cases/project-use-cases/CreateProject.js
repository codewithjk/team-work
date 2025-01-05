const Project = require("../../../domain/entities/Project");

class CreateProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute({ name, description, ownerId, coverImage }) {
    const project = new Project({ name, description, ownerId, coverImage });
    return await this.projectRepository.save(project);

  }
}

module.exports = CreateProject;
