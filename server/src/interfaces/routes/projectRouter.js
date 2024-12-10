const express = require("express");
const ProjectController = require("../controllers/projectController");
const verifyProjectMember = require("../middlewares/verifyProjectMember");
const router = express.Router();

const projectController = new ProjectController();

//Todo: add a middleware to protect project access from other user.


router
  .route("/")
  .get(projectController.getProjects)
  .post(projectController.createProject);
router
  .route("/:projectId").all(verifyProjectMember)// middleware to check isMember
  .get( projectController.getProjectById)
  .put(projectController.updateProjectById)
  .delete(projectController.deleteProjectById);
router
  .route("/:projectId/members")
  .post(projectController.addMember)
  .get(projectController.getMembers);

router.route("/verify").post(projectController.verifyMember);
module.exports = router;
