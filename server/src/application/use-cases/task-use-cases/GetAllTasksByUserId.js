class GetAllTasksByUserId {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(userId) {
    return await this.taskRepository.findByUserId(userId);
  }
}

module.exports = GetAllTasksByUserId;
