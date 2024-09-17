class UpdateTask {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }
  async execute(id, task) {
    return this.taskRepository.update(id, task);
  }
}

module.exports = UpdateTask;
