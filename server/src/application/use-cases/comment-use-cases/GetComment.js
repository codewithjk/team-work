class GetComment {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute(query) {
    return await this.commentRepository.find(query);
  }
}

module.exports = GetComment;
