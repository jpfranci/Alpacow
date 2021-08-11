import axios from "axios";
import {
  Comment,
  NewComment,
  NewPost,
  Post,
  PostState,
} from "../redux/slices/post-slice";
import ActionableError from "../errors/actionable-error";
import LoginErrorCode from "../errors/login-errors";

const baseUrl = "/api/posts";

const create = async (newPost: NewPost) => {
  const response = await axios.post(`${baseUrl}`, {
    title: newPost.title,
    body: newPost.body,
    lon: newPost.location.lon,
    lat: newPost.location.lat,
    tag: newPost.tag,
    isAnonymous: newPost.isAnonymous,
  });
  return response.data;
};

const getAll = async () => {
  const response = await axios.get(`${baseUrl}`);
  return response.data;
};

const getPostsByFilter = async (postState: PostState) => {
  const {
    sortType,
    locationFilter: { lat, lon },
    tagFilter,
    currentPostID,
    showMatureContent,
  } = postState;
  const response = await axios.get(`${baseUrl}`, {
    params: {
      sortType,
      lat,
      lon,
      tagFilter,
      currentPostID,
      showMatureContent,
    },
  });
  return response.data;
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

const upvote = async (id: string): Promise<Post> => {
  try {
    const response = await axios.post(`${baseUrl}/${id}/upvote`);
    return response.data;
  } catch (err) {
    if (err.response.status === 401) {
      throw new ActionableError(
        LoginErrorCode.USER_NOT_LOGGED_IN,
        "You must be be logged in to upvote",
      );
    }
    throw err;
  }
};

const downvote = async (id: string): Promise<Post> => {
  try {
    const response = await axios.post(`${baseUrl}/${id}/downvote`);
    return response.data;
  } catch (err) {
    if (err.response.status === 401) {
      throw new ActionableError(
        LoginErrorCode.USER_NOT_LOGGED_IN,
        "You must be be logged in to downvote",
      );
    }
    throw err;
  }
};

const createComment = async (newComment: NewComment, postId: string) => {
  try {
    const response = await axios.post(
      `${baseUrl}/${postId}/comments`,
      newComment,
    );
    return response.data;
  } catch (err) {
    if (err.response.status === 401) {
      throw new ActionableError(
        LoginErrorCode.USER_NOT_LOGGED_IN,
        "You must be be logged in to create comments",
      );
    }
    throw err;
  }
};

const upvoteComment = async (
  postId: string,
  commentId: string,
): Promise<Comment> => {
  try {
    const response = await axios.post(
      `${baseUrl}/${postId}/${commentId}/upvote`,
    );
    return response.data;
  } catch (err) {
    if (err.response.status === 401) {
      throw new ActionableError(
        LoginErrorCode.USER_NOT_LOGGED_IN,
        "You must be be logged in to upvote",
      );
    }
    throw err;
  }
};

const downvoteComment = async (
  postId: string,
  commentId: string,
): Promise<Comment> => {
  try {
    const response = await axios.post(
      `${baseUrl}/${postId}/${commentId}/downvote`,
    );
    return response.data;
  } catch (err) {
    if (err.response.status === 401) {
      throw new ActionableError(
        LoginErrorCode.USER_NOT_LOGGED_IN,
        "You must be be logged in to downvote",
      );
    }
    throw err;
  }
};

const postService = {
  create,
  getAll,
  getPostsByFilter,
  getByID,
  update,
  deleteByID,
  upvote,
  downvote,
  createComment,
  upvoteComment,
  downvoteComment,
};

export default postService;
