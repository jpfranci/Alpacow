import axios from "axios";
import { NewPost, PartialPost } from "../redux/slices/post-slice";

const baseUrl = "/api/posts";

// TODO add return types once backend types are done

const create = async (newPost: NewPost) => {
  const response = await axios.post(`${baseUrl}`, {
    ...newPost,
    // TODO delete below eventually - these props should be generated on backend
    upvotes: Math.floor(Math.random() * 10),
    downvotes: Math.floor(Math.random() * 10),
    createdAt: Date.now(),
  });
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
