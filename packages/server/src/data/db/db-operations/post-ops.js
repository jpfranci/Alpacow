const Post = require("../../models/post-model");

// We don't want to send all 1000 posts to the client while we have no filters,
// so this will just sample randomly from all posts
const getPosts = async () => {
  return Post.aggregate([{ $sample: { size: 50 } }]);
};

const createPost = async (post) => {
  const createdPost = Post.create(post);
  return createdPost.toObject();
};

const operations = {
  getPosts,
  createPost,
};

module.exports = operations;
