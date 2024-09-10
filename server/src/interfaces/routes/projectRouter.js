const express = require("express");
const ProjectController = require("../controllers/projectController");
const verifyJwtToken = require("../middlewares/verifyJwtToken");
const router = express.Router();

const projectController = new ProjectController();

router
  .route("/")
  // .all(verifyJwtToken)
  .get(projectController.getProjects)
  .post(projectController.createProject);

router
  .route("/:projectId")
  // .all(verifyJwtToken)
  .get(projectController.getProjectById)
  .put(projectController.updateProjectById)
  .delete(projectController.deleteProjectById);
router
  .route("/:projectId/members")
  // .all(verifyJwtToken)
  .post(projectController.addMember)
  .get(projectController.getMembers);

router
  .route("/verify")
  // .all(verifyJwtToken)
  .post(projectController.verifyMember);
module.exports = router;
