import profileApi from "../../infrastructure/api/profileApi";

class ProfileService {
  async getProfile(id) {
    const response = await profileApi.getProfile(id);
    console.log(response);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Authentication failed");
  }
}

export default new ProfileService();
