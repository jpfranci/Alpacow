const PostDb = require("../data/db/db-operations/post-ops");
const TagDb = require("../data/db/db-operations/tag-ops");

const createPost = async (post) => {
  const { tag, lat, lon } = post;
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

  const postToInsert = {
    ...post,
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
  };

  return PostDb.createPost(postToInsert);
};

const getPosts = () => {
  return PostDb.getPosts();
};

module.exports = {
  createPost,
  getPosts,
};
