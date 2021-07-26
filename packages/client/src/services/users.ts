import axios from "axios";
import { UserState } from "../redux/slices/user-slice";

const baseUrl = "/api/users";

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
  const response = await axios.post(`${baseUrl}`, {
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
    `${baseUrl}?username=${username}&password=${password}`,
  );
  return response;
};

const update = async (id: string, partialUser: Partial<UserState>) => {
  const response = await axios.put(`/users/${id}`, partialUser);
  return response;
};

const getPostsByUser = async (id: string, sortType: string) => {
  const response = await axios.get(`${baseUrl}/${id}/posts`, {
    params: {
      sortType: sortType,
    },
  });
  return response;
};

const userService = {
  signup,
  login,
  update,
  getPostsByUser,
};

export default userService;
