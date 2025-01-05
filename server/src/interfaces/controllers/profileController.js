const getProfile = require("../../application/use-cases/getProfile");
const updateProfile = require("../../application/use-cases/updateProfile");

class ProfileController {
  async getUser(req, res) {
    try {
      const id = req.params.id;
      const userDocument = await getProfile.execute(id);
      const user = userDocument.toObject();
      delete user.password;
      res.status(200).json({ message: "successful", profile: user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async updateUser(req, res) {
    try {
      const userId = req.userId;
      const userDocument = await updateProfile.execute(userId, req.body);


      const user = userDocument.toObject();
      res.status(200).json({ message: "successful", user });
    } catch (error) {
      console.error(error)
      res.status(400).json({ error: error.message });
    }
  }
  async getProjectList(req, res) {
    try {
      const userId = req.userId;
      const projectList = await getProjectList.execute(userId);
      res.status(200).json({ message: "successful", projectList });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ProfileController();
