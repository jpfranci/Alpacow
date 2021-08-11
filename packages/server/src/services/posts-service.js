const PostDb = require("../data/db/db-operations/post-ops");
const TagDb = require("../data/db/db-operations/tag-ops");
const UserDb = require("../data/db/db-operations/user-ops");
const axios = require("axios");

const callAzureApi = async (post) => {
  const headers = {
    "Content-Type": "text/plain",
    "Ocp-Apim-Subscription-Key": `${process.env.AZURE_API_KEY}`,
  };
  try {
    return await axios.post(
      "https://alpacow.cognitiveservices.azure.com/contentmoderator/moderate/v1.0/ProcessText/Screen?autocorrect=True&PII=True&classify=True&language=eng",
      `${post}`,
      { headers: headers },
    );
  } catch (err) {
    return {
      data: {
        Classification: {
          ReviewRecommended: true,
        },
      },
    };
  }
};

const checkIsMature = async (texts) => {
  let isMature = false;
  for (const text of texts) {
    const textModResponse = await callAzureApi(text);
    isMature =
      isMature || textModResponse.data.Classification.ReviewRecommended;
    await setTimeout(() => {}, 2000);
  }
  return isMature;
};

const createPost = async (post) => {
  const { tag, lat, lon, isAnonymous } = post;
  const doesTagExist = await TagDb.tagExists(tag);
  if (!doesTagExist) {
    try {
      await TagDb.createTag(tag);
    } catch (err) {
      if (err.code === 11000) {
        // ignore the tag has already been created
      }
    }
  }

  let username = null;
  let userId = null;

  if (!isAnonymous) {
    const user = await UserDb.getUser(post.userId);
    username = user.username;
    userId = post.userId;
  }

  const isMature = await checkIsMature([post.title, post.body]);

  const postToInsert = {
    ...post,
    userId: userId,
    date: new Date(),
    numUpvotes: 0,
    numDownvotes: 0,
    upvoters: [],
    downvoters: [],
    comments: [],
    location: {
      type: "Point",
      coordinates: [lon, lat],
    },
    isMature: isMature,
    username,
  };

  return PostDb.createPost(postToInsert);
};

const getPosts = (query) => {
  return PostDb.getPostsByFilter(query);
};

const getPostByID = async (id, userId) => {
  return PostDb.getPostByID(id, userId);
};

const getPostsByUserID = async (userId, sortType) => {
  return PostDb.getPostsByUserID(userId, sortType);
};

const getPostsByUserVote = async (uid, currentUserId, isUpvoted) => {
  const posts = await PostDb.getVotedPostsByUserID(
    uid,
    currentUserId,
    isUpvoted,
  );
  return posts;
};

const upvotePost = async (postId, currentUserId, userId) => {
  const post = await PostDb.upvotePost(postId, currentUserId, userId);
  return post;
};

const downvotePost = async (postId, userId) => {
  const post = await PostDb.downvotePost(postId, userId);
  return post;
};

const createComment = async (comment, postId) => {
  let username = null;
  let userId = null;
  if (!comment.isAnonymous) {
    const user = await UserDb.getUser(post.userId);
    username = user.username;
    userId = comment.userId;
  }

  const isMature = await checkIsMature([comment.body]);

  const commentToInsert = {
    ...comment,
    date: new Date(),
    userId,
    username,
    upvoters: [],
    downvoters: [],
    isMature,
  };

  return PostDb.createComment(commentToInsert, postId);
};

const upvoteComment = async (postId, commentId, userId) => {
  const comment = await PostDb.upvoteComment(postId, commentId, userId);
  return comment;
};

const downvoteComment = async (postId, commentId, userId) => {
  const comment = await PostDb.downvoteComment(postId, commentId, userId);
  return comment;
};

module.exports = {
  createPost,
  getPosts,
  getPostByID,
  getPostsByUserID,
  getPostsByUserVote,
  callAzureApi,
  upvotePost,
  downvotePost,
  createComment,
  upvoteComment,
  downvoteComment,
};
