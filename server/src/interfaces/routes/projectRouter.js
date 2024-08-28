const express = require("express");
const ProjectController = require("../controllers/projectController");
const verifyJwtToken = require("../middlewares/verifyJwtToken");
const router = express.Router();

const projectController = new ProjectController();

router
  .route("/")
  .all(verifyJwtToken) // Apply this middleware to all methods
  .get(projectController.getProjects) // Fetch list of projects with filter, search, and pagination
  .post(projectController.createProject);

router
  .route("/:projectId")
  .all(verifyJwtToken) // Apply this middleware to all methods for single project routes
  .get(projectController.getProjectById) // Get single project details
  .put(projectController.updateProjectById) // Update specific project
  .delete(projectController.deleteProjectById); // Delete specific project
router
  .route("/:projectId/members")
  .all(verifyJwtToken)
  .post(projectController.addMember);
router
  .route("/verify")
  .all(verifyJwtToken)
  .post(projectController.verifyMember);
module.exports = router;
