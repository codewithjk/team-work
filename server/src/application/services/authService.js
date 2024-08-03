const bcrypt = require("../../shared/utils/bcrypt");
const User = require("../../domain/entities/User");
const JwtToken = require("../../shared/utils/JwtToken");

class AuthService {
  async createUser(data, userRepository) {
    const { name, email, password } = data;
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password);
    const user = new User(name, email, hashedPassword, new Date(), new Date());
    return userRepository.save(user);
  }
  async loginUser(data, userRepository) {
    const { email, password } = data;
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    return await JwtToken.setToken(user);
  }
}

module.exports = new AuthService();
