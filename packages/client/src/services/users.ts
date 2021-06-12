import axios from "axios";
import { UserState } from "../redux/slices/user-slice";

export type LoginCredentials = {
  username: string;
  password: string;
};

export type SignupInfo = {
  username: string;
  password: string;
  email: string;
};

// TODO add return types once backend types are done

const signup = async (signupInfo: SignupInfo) => {
  // TODO this route should be sth like axios.post(`${baseUrl/signup}`, signupInfo)
  const response = await axios.post(`/users`, {
    ...signupInfo,
    // TODO delete below eventually - these props should be generated on backend
    posts: [],
    votedPosts: [],
  });
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

const update = async (id: string, partialUser: Partial<UserState>) => {
  const response = await axios.put(`/users/${id}`, partialUser);
  return response;
};

const authService = {
  signup,
  login,
  update,
};

export default authService;
