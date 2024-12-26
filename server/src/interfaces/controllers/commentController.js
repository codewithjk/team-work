const {
  CreateComment,
  ListAllComment,
  GetComment,
  UpdateComment,
  DeleteComment,
} = require("../../application/use-cases/comment-use-cases");
const CommentRepositoryImpl = require("../../infrastructure/database/repositories/commentRepositoryImpl");

const commentRepository = new CommentRepositoryImpl();

const creatCommentUseCase = new CreateComment(commentRepository);
const listAllCommentUseCase = new ListAllComment(commentRepository);
const getCommentUsecase = new GetComment(commentRepository);
const updateCommentUsecase = new UpdateComment(commentRepository);
const deleteCommentUsecase = new DeleteComment(commentRepository);


class CommentController {
  async createComment(req, res) {
    try {
      const { taskId } = req.query;
      const createdBy = req.userId;
      const newComment = await creatCommentUseCase.execute({
        taskId,
        ...req.body,
      });
      res.status(201).json({ message: "successful", comment: newComment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async getAllComments(req, res) {
    try {
      const { search, filter, page = 1, limit = 10, taskId } = req.query;
      if (taskId !== "undefined") {
        const { comments, totalPages } = await listAllCommentUseCase.execute({
          search,
          filter,
          page,
          limit,
          taskId,
        });
        res.status(200).json({
          comments,
          totalPages,
          currentPage: parseInt(page),
        });
      } else {
        const userId = req.userId;

        let result = await getAllCommentByUserIdUsecase.execute(userId);

        res.status(200).json({
          ...result,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch comments", message: error.message });
    }
  }
  async getCommentById(req, res) {
    try {
      const id = req.params.commentId;
      const comment = await getCommentUsecase.execute(id);
      res.status(200).json({ message: "successful", comment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateCommentById(req, res) {
    try {
      const comment = req.body;
      const id = req.params.commentId;
      const updatedComment = await updateCommentUsecase.execute(id, comment);
      res.status(200).json({ message: "successful", updatedComment });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to update comment", message: error.message });
    }
  }
  async deleteCommentById(req, res) {
    try {
      const id = req.params.commentId;
      await deleteCommentUsecase.execute(id);
      res.status(200).json({ message: "successful" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete comment", message: error.message });
    }
  }
}

module.exports = CommentController;
