const {
  CreateModule,
  ListAllModule,
  GetModule,
  UpdateModule,
  DeleteModule,
} = require("../../application/use-cases/module-use-cases");
const ModuleRepositoryImpl = require("../../infrastructure/database/repositories/moduleRepositoryImpl");

const moduleRepository = new ModuleRepositoryImpl();

const creatModuleUseCase = new CreateModule(moduleRepository);
const listAllModuleUseCase = new ListAllModule(moduleRepository);
const getModuleUsecase = new GetModule(moduleRepository);
const updateModuleUsecase = new UpdateModule(moduleRepository);
const deleteModuleUsecase = new DeleteModule(moduleRepository);

class ModuleController {
  async createModule(req, res) {
    try {
      const { projectId } = req.query;
      const newModule = await creatModuleUseCase.execute({
        projectId,
        ...req.body,
      });
      res.status(200).json({ message: "successful", module: newModule });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async getAllModules(req, res) {
    try {
      const { search, filter, page = 1, limit = 10, projectId } = req.query;
      const { modules, totalPages } = await listAllModuleUseCase.execute({
        search,
        filter,
        page,
        limit,
        projectId,
      });
      res.status(200).json({
        modules,
        totalPages,
        currentPage: parseInt(page),
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch modules", message: error.message });
    }
  }
  async getModuleById(req, res) {
    try {
      const id = req.params.moduleId;
      const module = await getModuleUsecase.execute(id);
      res.status(200).json({ message: "successful", module });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateModuleById(req, res) {
    try {
      const module = req.body;
      const id = req.params.moduleId;
      await updateModuleUsecase.execute(id, module);
      res.status(200).json({ message: "successful", module });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to update module", message: error.message });
    }
  }
  async deleteModuleById(req, res) {
    try {
      const id = req.params.moduleId;
      await deleteModuleUsecase.execute(id);
      res.status(200).json({ message: "successful" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete module", message: error.message });
    }
  }
}

module.exports = ModuleController;
