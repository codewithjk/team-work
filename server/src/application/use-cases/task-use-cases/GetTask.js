class GetTask {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskId) {
    return await this.taskRepository.findById(taskId);
  }
}

module.exports = GetTask;
