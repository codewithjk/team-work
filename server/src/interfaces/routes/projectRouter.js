const express = require("express");
const ProjectController = require("../controllers/projectController");
const verifyJwtToken = require("../middlewares/verifyJwtToken");
const router = express.Router();

const projectController = new ProjectController();

router
  .route("/")
  .get(projectController.getProjects)
  .post(projectController.createProject);

router
  .route("/:projectId")
  .get(projectController.getProjectById)
  .put(projectController.updateProjectById)
  .delete(projectController.deleteProjectById);
router
  .route("/:projectId/members")
  .post(projectController.addMember)
  .get(projectController.getMembers);

router.route("/verify").post(projectController.verifyMember);
module.exports = router;
