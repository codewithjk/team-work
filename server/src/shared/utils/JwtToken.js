const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

class Jwt {
  async setToken(data) {
    const { name, email } = data;
    const token = jwt.sign({ name, email, role: "user" }, secret, {
      expiresIn: "1h",
    });
    return { data, token };
  }
}

module.exports = new Jwt();
