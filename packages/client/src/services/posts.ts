import axios from "axios";

const baseUrl = "/api/posts";

// TODO add return types once backend types are done

export type NewPost = {
  title: string;
  location: string; // TODO prob change
  createdAt: number;
  upvotes: number;
  downvotes: number;
  tag: string; // TODO prob change
  userID: string;
  // reacts: string[] // TODO stretch goal
  // comments: string[] // TODO prob generate on backend
};

export type PartialPost = {
  [key in keyof NewPost]?: NewPost[key];
};

const create = async (newPost: NewPost) => {
  const response = await axios.post(`${baseUrl}`, newPost);
  return response;
};

const getAll = async () => {
  const response = await axios.get(`${baseUrl}`);
  return response;
};

const getByID = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response;
};

const update = async (id: string, partialPost: PartialPost) => {
  const response = await axios.put(`${baseUrl}/${id}`, partialPost);
  return response;
};

const deleteByID = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response;
};

const postService = {
  create,
  getAll,
  getByID,
  update,
  deleteByID,
};

export default postService;
