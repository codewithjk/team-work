class User {
  constructor(name, email, password, verificationToken, createdAt, updatedAt) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.verificationToken = verificationToken;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = User;
