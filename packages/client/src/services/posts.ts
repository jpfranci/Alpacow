import axios from "axios";
import { NewPost, Post, PostState } from "../redux/slices/post-slice";

const baseUrl = "/api/posts";

// TODO add return types once backend types are done

const create = async (newPost: NewPost) => {
  const response = await axios.post(`${baseUrl}`, {
    ...newPost,
    // TODO delete below eventually - these props should be generated on backend
    upvotes: 0,
    downvotes: 0,
    createdAt: Date.now(),
  });
  return response;
};

const getAll = async () => {
  const response = await axios.get(`${baseUrl}`);
  return response;
};

const getPostsByFilter = async (postState: PostState) => {
  const {
    sortType,
    locationFilter: { lat, lon },
    tagFilter,
    currentPostID,
  } = postState;
  const response = await axios.get(`${baseUrl}`, {
    params: {
      sortType,
      lat,
      lon,
      tagFilter,
      currentPostID,
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
