class CreateTask {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(task) {
    return await this.taskRepository.save(task);
  }
}

module.exports = CreateTask;
