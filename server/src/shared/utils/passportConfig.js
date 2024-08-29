const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const jwt = require("jsonwebtoken");

// Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
      authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, { accessToken });
    }
  )
);

// GitHub OAuth configuration
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/github/callback",
      scope: ["user:email"],
    },
    (accessToken, refreshToken, profile, done) => {
      // Here, you can create/find a user in your database based on the profile information

      console.log(profile);

      done(null, { accessToken });
    }
  )
);

// Serialize user into JWT
// passport.serializeUser((user, done) => {
//   const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
//   done(null, token);
// });

// // Deserialize user from JWT
// passport.deserializeUser((token, done) => {
//   try {
//     const user = jwt.verify(token, process.env.JWT_SECRET);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });