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

const getPostsByFilter = async (lon, lat) => {
  return await Post.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lon, lat],
        },
        $minDistance: 0,
        $maxDistance: 750,
      },
    },
  });
};

const operations = {
  getPosts,
  getPostsByFilter,
  createPost,
};

module.exports = operations;
