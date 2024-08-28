class Project {
  constructor({ name, description, ownerId, members = [], coverImage }) {
    this.name = name;
    this.description = description;
    this.ownerId = ownerId;
    this.members = members;
    this.coverImage = coverImage;
  }
  toDTO() {
    return {
      name: this.name,
      description: this.description,
      ownerId: this.ownerId,
      coverImage: this.coverImage,
    };
  }
}

module.exports = Project;
