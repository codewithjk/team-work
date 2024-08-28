class VerifyMember {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute({ token }) {
    return await this.projectRepository.verifyMember({
      token,
    });
  }
}

module.exports = VerifyMember;
