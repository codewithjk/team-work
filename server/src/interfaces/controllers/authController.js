const createUser = require("../../application/use-cases/createUser");
const loginUser = require("../../application/use-cases/loginUser");
const sendResetPasswordMail = require("../../application/use-cases/sendResetPasswordMail");
const updatePassword = require("../../application/use-cases/updatePassword");
const verifyUser = require("../../application/use-cases/verifyUser");
class AuthController {
  async register(req, res) {
    try {
      const user = await createUser.execute(req.body);
      res.cookie("token", user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const { name, email, isVerified } = user;
      res.status(201).json({ name, email, isVerified });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async login(req, res) {
    try {
      const user = await loginUser.execute(req.body);
      res.cookie("token", user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const { name, email, isVerified } = user;
      res.status(200).json({ name, email, isVerified });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async verify(req, res) {
    try {
      const { code } = req.body;
      console.log(code);
      await verifyUser.execute(code);
      res.status(200).json({ success: true, message: "validation success" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      await sendResetPasswordMail.execute(email);
      res.status(200).json({
        success: true,
        message: `reset password mail sent to ${email}`,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async resetPassword(req, res) {
    try {
      const { password } = req.body;
      await updatePassword.execute(password, token);
      res.status(200).json({
        success: true,
        message: `password changed successfully`,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
