const createUser = require("../../application/use-cases/createUser");

class UserController {
  async register(req, res) {
    console.log(req.body);
    try {
      const user = await createUser.execute(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
