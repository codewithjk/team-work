class ListAllTask {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(query) {
    return this.taskRepository.findAll(query);
  }
}

module.exports = ListAllTask;
