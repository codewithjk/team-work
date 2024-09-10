class Module {
  constructor({
    name,
    description,
    startDate,
    targetDate,
    status,
    lead,
    members = [],
    projectId,
  }) {
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.targetDate = targetDate;
    this.status = status;
    this.lead = lead;
    this.members = members;
    this.projectId = projectId;
  }

  toDTO() {
    return {
      name: this.name,
      description: this.description,
      startDate: this.startDate,
      targetDate: this.targetDate,
      status: this.status,
      lead: this.lead,
      members: this.members,
      projectId: this.projectId,
    };
  }
}

module.exports = Module;
