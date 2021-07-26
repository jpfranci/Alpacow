import axios from "axios";
import { UserState } from "../redux/slices/user-slice";
import { Post } from "../redux/slices/post-slice";

const baseUrl = "/api/users";

export type LoginCredentials = {
  email: string;
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

const login = async (idToken: string) => {
  const response = await axios.post(`${baseUrl}/login`, { idToken });
  return response.data;
};

const update = async (id: string, partialUser: Partial<UserState>) => {
  const response = await axios.put(`/users/${id}`, partialUser);
  return response;
};

const getPostsByUser = async (
  id: string,
  sortType: string,
): Promise<Post[]> => {
  const response = await axios.get(`${baseUrl}/${id}/posts`, {
    params: {
      sortType: sortType,
    },
  });
  return response.data;
};

const userService = {
  signup,
  login,
  update,
  getPostsByUser,
};

export default userService;
