const jwt = require("jsonwebtoken");
require("dotenv").config()
const secret = process.env.JWT_SECRET;

class Jwt {
  async setToken(user) {
    console.log("this is from twt tocken : ", user)
    const { _id, name, email } = user;
    const accessToken = jwt.sign({ userId: _id, name, email, role: "user" }, secret, {
      expiresIn: process.env.ACCESSTOKEN_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ userId: _id, name, email, role: "user" }, secret, {
      expiresIn: process.env.REFRESHTOKEN_EXPIRES_IN,
    });
    return { user, refreshToken, accessToken };
  }
}

module.exports = new Jwt();
