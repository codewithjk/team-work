const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const apiRoot = process.env.API_ROOT;

router.post(`/register`, userController.register);

module.exports = router;
