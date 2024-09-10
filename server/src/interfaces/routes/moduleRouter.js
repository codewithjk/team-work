const express = require("express");
const ModuleController = require("../controllers/moduleController");

const router = express.Router();

const moduleController = new ModuleController();

router
  .route("/")
  .get(moduleController.getAllModules)
  .post(moduleController.createModule);

router
  .route("/:moduleId")
  .get(moduleController.getModuleById)
  .put(moduleController.updateModuleById)
  .delete(moduleController.deleteModuleById);

module.exports = router;
