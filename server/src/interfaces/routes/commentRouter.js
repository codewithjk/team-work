const express = require("express");
const CommentController = require("../controllers/commentController");
const router = express.Router();
const commentController = new CommentController();
router
    .route("/")
    .get(commentController.getAllComments)
    .post(commentController.createComment);

router
    .route("/:commentId")
    .get(commentController.getCommentById)
    .put(commentController.updateCommentById)
    .delete(commentController.deleteCommentById);

module.exports = router;