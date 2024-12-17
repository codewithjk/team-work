const bcrypt = require("../../shared/utils/bcrypt");
const User = require("../../domain/entities/User");
const JwtToken = require("../../shared/utils/JwtToken");
const generateVerificationCode = require("../../shared/utils/generateVerificationCode");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../../shared/mailtrap/emails");
require('dotenv').config()

class AuthService {
  async createUser(data, userRepository) {
    try {
      const { name, email, password, oauthId } = data;
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser && oauthId) {
        return await JwtToken.setToken(existingUser);
      } else if (existingUser) {
        throw new Error("User already exists");
      } else if (oauthId) {
        const newOAuthUser = await userRepository.save({
          ...data,
          isVerified: true,
        });
        return await JwtToken.setToken(newOAuthUser);
      } else {
        const hashedPassword = await bcrypt.hash(password);
        const verificationToken = generateVerificationCode();
        const user = new User(
          name,
          email,
          hashedPassword,
          verificationToken,
          new Date(),
          new Date()
        );
        const newUser = await userRepository.save({
          ...user,
          verificationTokenExpiresAt: Date.now() + 1 * 60 * 1000,
        });
        await sendVerificationEmail(newUser.email, newUser.verificationToken);
        return await JwtToken.setToken(newUser);
      }
    } catch (error) {
      throw error;
    }
  }
  async loginUser(data, userRepository) {
    try {
      const { email, password } = data;
      const user = await userRepository.findByEmail(email);
      console.log(user)
      if (!user) {
        throw new Error("User not found");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }
      return await JwtToken.setToken(user);
    } catch (error) {
      console.log("servive", error);

      throw error;
    }
  }
  async verifyUser(code, userRepository) {
    try {
      const verifiedUser = await userRepository.findByVerificationToken(code);
      if (!verifiedUser) {
        throw new Error("Invalid token");
      }
      verifiedUser.isVerified = true;
      verifiedUser.verificationToken = undefined;
      verifiedUser.verificationTokenExpiresAt = undefined;
      await userRepository.save(verifiedUser);
      sendWelcomeEmail(verifiedUser.email, verifiedUser.name);
      return await JwtToken.setToken(verifiedUser);
    } catch (error) {
      throw error;
    }
  }
  async sendResetPasswordMail(email, userRepository) {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error("Invalid email, user not found");
      }
      const resetToken = generateVerificationCode();
      user.resetPsswordToken = resetToken;
      user.resetPsswordTokenExpiresAt = Date.now() + 1 * 60 * 1000;
      await userRepository.save(user);
      await sendPasswordResetEmail(
        email,
        `${process.env.WEB_APP_ORIGIN}/reset-password/${resetToken}`
      );
      return user;
    } catch (error) {
      throw error;
    }
  }
  async updatePassword(password, token, userRepository) {
    try {
      const user = await userRepository.findByResetPsswordToken(token);
      if (!user) {
        throw new Error("Invalid or expired link");
      }
      //update password
      const hashedPassword = await bcrypt.hash(password);
      user.password = hashedPassword;
      user.resetPsswordToken = undefined;
      user.resetPsswordTokenExpiresAt = undefined;
      await userRepository.save(user);
      await sendResetSuccessEmail(user.email);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
  async checkAuth(id, userRepository) {
    try {
      const user = await userRepository.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  }
  async getProfile(id, userRepository) {
    try {
      const user = await userRepository.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  }
  async resendCode(data, userRepository) {
    try {
      const { userId } = data;
      const user = await userRepository.findById(userId);
      const verificationToken = generateVerificationCode();
      user.verificationTokenExpiresAt = Date.now() + 1 * 60 * 1000;
      user.verificationToken = verificationToken;
      await userRepository.save(user);
      await sendVerificationEmail(user.email, user.verificationToken);
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
