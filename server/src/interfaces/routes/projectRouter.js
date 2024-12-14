const express = require("express");
const ProjectController = require("../controllers/projectController");
const verifyProjectMember = require("../middlewares/verifyProjectMember");
const checkPremium = require("../middlewares/checkPremium");
const router = express.Router();

const projectController = new ProjectController();

//Todo: add a middleware to protect project access from other user.

router
  .route("/:projectId/members")
  .post(projectController.addMember)
  .get(projectController.getMembers);

router.route("/verify").post(projectController.verifyMember);
router
  .route("/")
  .get(projectController.getProjects)
  .post(checkPremium, projectController.createProject);
router
  .route("/:projectId")// middleware to check isMember
  .get(projectController.getProjectById).all(verifyProjectMember)
  .put(projectController.updateProjectById)
  .delete(projectController.deleteProjectById);

module.exports = router;
