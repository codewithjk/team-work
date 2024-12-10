const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

class Jwt {
  async setToken(user) {
    const { _id, name, email } = user;
    const accessToken = jwt.sign({ userId: _id, name, email, role: "user" }, secret, {
      expiresIn: "1h",
    });
    const refreshToken  = jwt.sign({ userId: _id, name, email, role: "user" }, secret, {
      expiresIn: "1y",
    });
    return { user, refreshToken,accessToken};
  }
}

module.exports = new Jwt();
