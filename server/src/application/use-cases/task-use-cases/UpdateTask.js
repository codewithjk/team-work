class UpdateTask {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }
  async execute(id, task) {
    console.log(id, task);
    return this.taskRepository.update(id, task);
  }
}

module.exports = UpdateTask;
