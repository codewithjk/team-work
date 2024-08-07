import User from "../../domain/entities/User";
import authApi from "../../infrastructure/api/authApi";

class AuthService {
  async authenticateUser(email, password) {
    const response = await authApi.login(email, password);
    console.log("hello ==> ", response);
    if (response.status === 200) {
      const { id, token } = response.data;
      localStorage.setItem("token", token);
      return new User(id, email, token);
    }
    throw new Error("Authentication failed");
  }
}

export default new AuthService();
