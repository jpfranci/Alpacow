const Post = require("../models/post-model");

// We don't want to send all 1000 posts to the client while we have no filters,
// so this will just sample randomly from all posts
const getPosts = async () => {
  return await Post.aggregate([{ $sample: { size: 10 } }]);
};

const operations = {
  getPosts,
};

module.exports = operations;
