const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

class Jwt {
  async setToken(data) {
    const { _id, name, email } = data;
    const token = jwt.sign({ userId: _id, name, email, role: "user" }, secret, {
      expiresIn: "1h",
    });
    console.log(data);
    return { data, token };
  }
}

module.exports = new Jwt();
