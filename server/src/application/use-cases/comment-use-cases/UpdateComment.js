class UpdateComment {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }
  async execute(id, comment) {
    return this.commentRepository.update(id, comment);
  }
}

module.exports = UpdateComment;
