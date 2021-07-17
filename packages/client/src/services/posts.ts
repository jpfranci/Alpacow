import axios from "axios";
import { NewPost, Post, PostState } from "../redux/slices/post-slice";

const baseUrl = "/api/posts";

// TODO add return types once backend types are done

const create = async (newPost: NewPost) => {
  const response = await axios.post(`${baseUrl}`, {
    params: newPost,
  });
  return response;
};

const getAll = async () => {
  const response = await axios.get(`${baseUrl}`);
  return response;
};

const getPostsByFilter = async (postState: PostState) => {
  const response = await axios.get(`${baseUrl}`, {
    params: {
      posts: [],
      sortType: postState.sortType,
      locationFilter: postState.locationFilter,
      tagFilter: postState.tagFilter,
      currentPostID: postState.currentPostID,
      showMatureContent: postState.showMatureContent,
    },
  });
  return response;
};

const getByID = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response;
};

const update = async (id: string, partialPost: Partial<Post>) => {
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
  getPostsByFilter,
  getByID,
  update,
  deleteByID,
};

export default postService;
