import axios from "axios";

const baseUrl = "/api/auth";

export type LoginCredentials = {
  username: string;
  password: string;
};

export type SignupInfo = {
  username: string;
  password: string;
  email: string;
};

// TODO improve typing
const signup = async (signupInfo: SignupInfo) => {
  const response = await axios.post(`/users`, signupInfo);
  return response.data;
};

const login = async (credentials: LoginCredentials) => {
  // TODO this route should be axios.post(`${baseUrl/login}`, credentials)
  const response = await axios.get(`/users/1`);
  return response.data;
};

const authService = {
  signup,
  login,
};

export default authService;
