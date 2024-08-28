class BaseRepository {
  constructor(model) {
    this.model = model;
  }
  async findById(id) {
    return await this.model.findById(id);
  }
}

module.exports = BaseRepository;
