const { ListAllMembers, GetProject } = require("../../application/use-cases/project-use-cases");
const ProjectRepositoryImpl = require("../../infrastructure/database/repositories/projectRepositoryImpl");

const projectRepository = new ProjectRepositoryImpl()
const listAllMembersUseCase = new ListAllMembers(projectRepository);
const getProjectUseCase = new GetProject(projectRepository)
const verifyProjectMember = async (req, res, next) => {
    try {
        const userId = req.userId;
        const projectId = req.params.projectId || req.query.projectId;
        let ownerId;
        let project;
        let members;
        if (!projectId || projectId == "undefined") {
            return next()
        } else if (projectId) {
            project = await getProjectUseCase.execute(projectId)
            members = await listAllMembersUseCase.execute(projectId)
            ownerId = project.ownerId;
        }

        const member = members.find((member) => member.user._id == userId);
        if (member || ownerId == userId) {
            return next();
        } else {
            return res.status(403).json({ message: "Access denied. You are not a member of this project." });
        }
    } catch (error) {
        console.error("Error verifying project member:", error);
        return res.status(500).json({ message: "Internal server error." });

    }
}


module.exports = verifyProjectMember