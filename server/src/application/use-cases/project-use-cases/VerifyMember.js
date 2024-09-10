class VerifyMember {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute({ token, userId }) {
    return await this.projectRepository.verifyMember({
      token,
      userId,
    });
  }
}

module.exports = VerifyMember;
