const getProfile = require("../../application/use-cases/getProfile");

class ProfileController {
  // constructor(Entity,Usecase,Service,Repository){
  //     this.Entity = Entity
  // }
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
}

module.exports = new ProfileController();
