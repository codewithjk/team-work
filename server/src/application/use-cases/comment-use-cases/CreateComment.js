class CreateComment {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }
  async execute(comment) {
    return await this.commentRepository.save(comment);
  }
}

module.exports = CreateComment;
