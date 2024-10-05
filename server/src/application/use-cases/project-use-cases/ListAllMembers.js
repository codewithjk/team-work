class ListAllMembers {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  // TODO : correct this argument .
  async execute({ projectId }) {
    return this.projectRepository.getMembersByProjectId(projectId);
  }
}

module.exports = ListAllMembers;
