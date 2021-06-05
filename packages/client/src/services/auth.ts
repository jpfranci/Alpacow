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

const signup = async (signupInfo: SignupInfo) => {
  // TODO this route should be sth like axios.post(`${baseUrl/signup}`, signupInfo)
  const response = await axios.post(`/users`, signupInfo);
  return response;
};

const login = async (credentials: LoginCredentials) => {
  // TODO this route should be sth like axios.post(`${baseUrl/login}`, credentials)
  const { username, password } = credentials;
  const response = await axios.get(
    `/users?username=${username}&password=${password}`,
  );
  return response;
};

const authService = {
  signup,
  login,
};

export default authService;
