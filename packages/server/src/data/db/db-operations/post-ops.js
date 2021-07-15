const Post = require("../../models/post-model");

// We don't want to send all 1000 posts to the client while we have no filters,
// so this will just sample randomly from all posts
const getPosts = async () => {
  return await Post.aggregate([{ $sample: { size: 50 } }]);
};

const getPostsByFilter = async (req) => {
  return await Post.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(req.query.lon), parseFloat(req.query.lat)],
        },
        $minDistance: 0,
        $maxDistance: 1000,
      },
    },
  });
};

const operations = {
  getPosts,
  getPostsByFilter,
};

module.exports = operations;
