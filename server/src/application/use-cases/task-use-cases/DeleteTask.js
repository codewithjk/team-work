class DeleteTask {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(id) {
    return await this.taskRepository.delete(id);
  }
}

module.exports = DeleteTask;
