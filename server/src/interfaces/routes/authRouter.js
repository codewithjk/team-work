const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const passport = require("passport");
const verifyToken = require("../middlewares/verifyJwtToken");

require("../../shared/utils/passportConfig");

router.use(passport.initialize());
router.post(`/register`, authController.register);
router.post(`/login`, authController.login);
router.post(`/verify-email`, authController.verify);
router.post(`/forgot-password`, authController.forgotPassword);
router.post(`/reset-password/:token`, authController.resetPassword);
router.post(`/check-auth`, verifyToken, authController.checkAuth);
router.post(`/oauth-signup`, authController.oauthSignup);
router.post(`/logout`, authController.logout);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    res.redirect(
      `${process.env.WEB_APP_ORIGIN}/handle-google-auth/${req.user.accessToken}`
    );
  }
);

// GitHub OAuth routes
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    res.redirect(
      `${process.env.WEB_APP_ORIGIN}/handle-github-auth/${req.user.accessToken}`
    );
  }
);

module.exports = router;
