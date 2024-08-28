const {
  sendPasswordResetEmail,
  sendInviteEmail,
} = require("../../../shared/mailtrap/emails");
const generateVerificationCode = require("../../../shared/utils/generateVerificationCode");

class AddMember {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute({ email, projectId, role }) {
    try {
      const inviteToken = generateVerificationCode();
      const newMember = await this.projectRepository.addMember({
        email,
        projectId,
        inviteToken,
        role,
      });
      const project = await this.projectRepository.findById(projectId);
      const { name } = project;
      await sendInviteEmail(
        email,
        `${process.env.WEB_APP_ORIGIN}/verify-invite/${inviteToken}`,
        name
      );

      return newMember;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AddMember;
