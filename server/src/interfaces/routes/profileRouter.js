const express = require("express");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.get(`/:id`, profileController.getUser);
router.put(`/`, profileController.updateUser);
router.get(`/myprojects`, profileController.getProjectList);

module.exports = router;
