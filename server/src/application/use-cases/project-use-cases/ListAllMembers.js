class ListAllMembers {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }
  async execute( projectId ) {
    return this.projectRepository.getMembersByProjectId(projectId);
  }
}

module.exports = ListAllMembers;
