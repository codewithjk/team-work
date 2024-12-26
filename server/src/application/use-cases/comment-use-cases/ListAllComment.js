class ListAllComment {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute(query) {
    return this.commentRepository.findAll(query);
  }
}

module.exports = ListAllComment;
