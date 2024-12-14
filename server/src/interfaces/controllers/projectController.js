const {
  CreateProject,
  ListAllProject,
  GetProject,
  UpdateProject,
  DeleteProject,
  AddMember,
  VerifyMember,
  ListAllMembers,
} = require("../../application/use-cases/project-use-cases");
const ProjectRepositoryImpl = require("../../infrastructure/database/repositories/projectRepositoryImpl");
const projectRepository = new ProjectRepositoryImpl();
const createProjectUsecase = new CreateProject(projectRepository);
const listAllProjectUsecase = new ListAllProject(projectRepository);
const getProjectUsecase = new GetProject(projectRepository);
const updateProjectUsecase = new UpdateProject(projectRepository);
const deleteProjectUsecase = new DeleteProject(projectRepository);
const addMemberUsecase = new AddMember(projectRepository);
const verifyMemberUsecase = new VerifyMember(projectRepository);
const listAllMemebersOfProjectUsecase = new ListAllMembers(projectRepository);
class ProjectController {
  async createProject(req, res) {
    try {
      const ownerId = req.userId;

      const newProject = await createProjectUsecase.execute({
        ...req.body,
        ownerId,
      });
      res.status(200).json({ message: "successful", project: newProject });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async getProjects(req, res) {
    try {
      const ownerId = req.userId;
      const { search, filter, page = 1, limit = 10 } = req.query;

      const { projects, totalPages } = await listAllProjectUsecase.execute({
        search,
        filter,
        page,
        limit,
        ownerId,
      });

      res.status(200).json({
        projects,
        totalPages,
        currentPage: parseInt(page),
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch projects", message: error.message });
    }
  }
  async getProjectById(req, res) {
    const id = req.params.projectId;
    const project = await getProjectUsecase.execute(id);
    res.status(200).json({ message: "successful", project });
  }
  async updateProjectById(req, res) {
    try {
      const project = req.body;
      const id = req.params.projectId;
      await updateProjectUsecase.execute(id, project);
      res.status(200).json({ message: "successful", project });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to update project", message: error.message });
    }
  }
  async deleteProjectById(req, res) {
    try {
      const id = req.params.projectId;
      await deleteProjectUsecase.execute(id);
      res.status(200).json({ message: "successful" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete project", message: error.message });
    }
  }
  async addMember(req, res) {
    try {
      const projectId = req.params.projectId;
      const { email, role } = req.body;
      const newMember = await addMemberUsecase.execute({
        email,
        projectId,
        role,
      });
      res.status(200).json({ message: "invitation sent successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to send invitation", message: error.message });
    }
  }
  async verifyMember(req, res) {
    try {
      const { token } = req.body;
      const userId = req.userId;
      const verifiedMember = await verifyMemberUsecase.execute({
        token,
        userId,
      });
      res.status(200).json({ message: " successfully verified" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to verify", message: error.message });
    }
  }
  async getMembers(req, res) {
    try {
      const projectId = req.params.projectId;
      const ownerId = req.userId;

      const members = await listAllMemebersOfProjectUsecase.execute(
        projectId,
      );

      res.status(200).json({
        members,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch members", message: error.message });
    }
  }
}

module.exports = ProjectController;
