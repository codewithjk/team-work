const bcrypt = require("../../shared/utils/bcrypt");
const User = require("../../domain/entities/User");

class UserService {
  async createUser(data, userRepository) {
    console.log("data = ", data);
    const { name, email, password, role } = data;
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password);
    const user = new User(
      name,
      email,
      hashedPassword,
      role,
      new Date(),
      new Date()
    );
    return userRepository.save(user);
  }
}

module.exports = new UserService();
