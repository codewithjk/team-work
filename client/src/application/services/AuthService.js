import authApi from "../../infrastructure/api/authApi";

class AuthService {
  async authenticateUser(email, password) {
    const response = await authApi.login(email, password);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Authentication failed");
  }
  async createUser(user) {
    const response = await authApi.signup(user);
    console.log(response);
    if (response.status === 201) {
      const { _id, name, email } = response.data;
      return response.data;
    }
    throw new Error("Signup failed");
  }
  async forgotPassword(email) {
    const response = await authApi.forgotPassword(email);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to send mail");
  }
  async resetPassword(token, password) {
    const response = await authApi.resetPassword(token, password);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to update password");
  }
  async verifyMail(code) {
    const response = await authApi.verifyMail(code);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to verify");
  }
  async checkAuth() {
    const response = await authApi.checkAuth();
    console.log("checkauth");
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("unauthorised access");
  }
  async logout() {
    const response = await authApi.logout();
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("failed to logout");
  }
}

export default new AuthService();
