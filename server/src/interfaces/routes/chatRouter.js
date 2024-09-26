const express = require("express");

const { getAllChats } = require("../socket_handlers/chatHandler");

const router = express.Router();

router.route("/").get(getAllChats);

module.exports = router;
