const createUser = require("../../application/use-cases/createUser");
const loginUser = require("../../application/use-cases/loginUser");

class AuthController {
  async register(req, res) {
    try {
      const user = await createUser.execute(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async login(req, res) {
    try {
      const user = await loginUser.execute(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
