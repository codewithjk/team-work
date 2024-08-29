const Project = require("../../../domain/entities/Project");

class ListAllProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(query) {
    return this.projectRepository.findAll(query);
  }
}

module.exports = ListAllProject;
