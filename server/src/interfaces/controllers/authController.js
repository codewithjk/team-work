const checkAuth = require("../../application/use-cases/checkAuth");
const createUser = require("../../application/use-cases/createUser");
const loginUser = require("../../application/use-cases/loginUser");
const resendCode = require("../../application/use-cases/resendCode");
const sendResetPasswordMail = require("../../application/use-cases/sendResetPasswordMail");
const updatePassword = require("../../application/use-cases/updatePassword");
const verifyUser = require("../../application/use-cases/verifyUser");
class AuthController {
  async register(req, res, next) {
    try {
      const {user,accessToken,refreshToken} = await createUser.execute(req.body);
      const { _id, name, email, isVerified, verificationTokenExpiresAt } =
        user;
      if (accessToken && refreshToken) {
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .header('Authorization', accessToken);
      }

      res
        .status(201)
        .json({ id: _id, name, email, isVerified, verificationTokenExpiresAt });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async login(req, res) {
    try {
      const {user,refreshToken,accessToken} = await loginUser.execute(req.body);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const { _id, name, email, isVerified } = user;

      res.status(200).json({
        message: "login success",
        user: { id: _id, name, email, isVerified },
        accessToken
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async verify(req, res) {
    try {
      const { code } = req.body;

      const {user,refreshToken,accessToken} = await verifyUser.execute(code);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }).header('Authorization', accessToken);
      const { _id, name, email, isVerified } = user.data;
      res.status(200).json({
        success: true,
        message: "validation success",
        user: { id: _id, name, email, isVerified },
      });
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
      const { token } = req.params;

      await updatePassword.execute(password, token);
      res.status(200).json({
        success: true,
        message: `password changed successfully`,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async checkAuth(req, res) {
    try {
      const id = req.userId;
      const user = await checkAuth.execute(id);
      const { _id, name, email, isVerified } = user;
      console.log("check auth called", id);
      res.status(200).json({
        message: "success",
        user: { id: _id, name, email, isVerified },
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async oauthSignup(req, res) {
    try {
      const user = await oauthSignup.execute(req.body);
      // res.cookie("access_token", user.token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // });

      const { _id, name, email, isVerified } = user;
      res.status(201).json({ id: _id, name, email, isVerified });
    } catch (error) {
      console.log("erororrrrrr: ", error);
      res.status(400).json({ error: error.message });
    }
  }
  async logout(req, res) {
    try {
      // Clear refresh token from cookies
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      });
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
  }
  async resendCode(req, res) {
    try {
      const { userId } = req.body;
      console.log(userId);

      const user = await resendCode.execute({ userId });
      console.log(user);
      const { _id, name, email, isVerified, verificationTokenExpiresAt } = user;
      res.status(200).json({
        message: "successfully resend code",
        user: { id: _id, name, email, isVerified, verificationTokenExpiresAt },
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async refresh(req,res){
    const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  }

  try {
    const decoded = jwt.verify(refreshToken, secretKey);
    const accessToken = jwt.sign({ user: decoded.user }, secretKey, { expiresIn: '1h' });

    res
      .header('Authorization', accessToken)
      .send(decoded.user);
  } catch (error) {
    return res.status(400).send('Invalid refresh token.');
  }
  }
}

module.exports = new AuthController();
