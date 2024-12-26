class DeleteComment {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute(id) {
    return await this.commentRepository.delete(id);
  }
}

module.exports = DeleteComment;
