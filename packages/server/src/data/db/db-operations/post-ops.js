const Post = require("../../models/post-model");

// We don't want to send all 1000 posts to the client while we have no filters,
// so this will just sample randomly from all posts
const getPosts = async () => {
  const posts = await Post.aggregate([{ $sample: { size: 50 } }]);
  return posts;
};

const createPost = async (post) => {
  const createdPost = await Post.create(post);
  return createdPost.toObject();
};

const getPostsByFilter = async ({
  lon,
  lat,
  tagFilter,
  sortType,
  showMatureContent,
}) => {
  const aggregationPipeline = [];
  aggregationPipeline.push({
    $geoNear: {
      near: { type: "Point", coordinates: [lon, lat] },
      key: "location",
      distanceField: "distance",
      minDistance: 0,
      maxDistance: 1500,
    },
  });
  if (tagFilter) {
    aggregationPipeline.push({
      $match: {
        tag: tagFilter,
      },
    });
  }
  if (!showMatureContent) {
    aggregationPipeline.push({ $match: { isMature: false } });
  }
  aggregationPipeline.push({
    $project: {
      title: true,
      body: true,
      date: true,
      numUpvotes: true,
      numDownvotes: true,
      username: true,
      tag: true,
      score: { $subtract: ["$numUpvotes", "$numDownvotes"] },
      isMature: true,
    },
  });
  aggregationPipeline.push({
    // additional arguments are to break ties
    $sort:
      sortType === "popular"
        ? { score: -1, date: -1, _id: -1 }
        : { date: -1, _id: -1 },
  });
  const posts = await Post.aggregate(aggregationPipeline);
  return posts;
};

const getPostByID = async (id) => {
  return await Post.findById(id, {
    title: true,
    body: true,
    date: true,
    numUpvotes: true,
    numDownvotes: true,
    username: true,
    tag: true,
    score: { $subtract: ["$numUpvotes", "$numDownvotes"] },
    isMature: true,
    comments: true,
  });
};

const getPostsByUserID = async (userId, sortType) => {
  const aggregation = [];
  aggregation.push({
    $match: {
      userId: userId,
    },
  });
  aggregation.push({
    $project: {
      title: true,
      body: true,
      date: true,
      numUpvotes: true,
      numDownvotes: true,
      username: true,
      tag: true,
      score: { $subtract: ["$numUpvotes", "$numDownvotes"] },
      isMature: true,
    },
  });
  aggregation.push({
    $sort:
      sortType === "popular"
        ? { score: -1, date: -1, _id: -1 }
        : { date: -1, _id: -1 },
  });
  const posts = await Post.aggregate(aggregation);
  return posts;
};

const getVotedPostsByUserID = async (userId, upvote) => {
  const voteField = upvote ? "upvoters" : "downvoters";

  const aggregation = [];
  aggregation.push({
    $match: {
      [voteField]: { $in: [userId] },
    },
  });
  aggregation.push({
    $project: {
      title: true,
      body: true,
      date: true,
      numUpvotes: true,
      numDownvotes: true,
      username: true,
      tag: true,
      score: { $subtract: ["$numUpvotes", "$numDownvotes"] },
      isMature: true,
    },
  });
  const posts = await Post.aggregate(aggregation);
  return posts;
};

const upvotePost = async (postId, userId) => {
  const updateSpec = {
    $push: { upvoters: userId },
    $pull: { downvoters: userId },
    $inc: { numUpvotes: 1 },
  };

  // TODO can avoid making mult async requests if we inferred vote counts from voter array length
  const post = await Post.findById(postId);
  if (post.downvoters.includes(userId)) {
    updateSpec.$inc.numDownvotes = -1;
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, updateSpec, {
    new: true,
  });

  return updatedPost
    ? { ...updatedPost.toJSON(), comments: undefined } // TODO use $project instead
    : undefined;
};

const downvotePost = async (postId, userId) => {
  const updateSpec = {
    $push: { downvoters: userId },
    $pull: { upvoters: userId },
    $inc: { numDownvotes: 1 },
  };

  const post = await Post.findById(postId);
  if (post.upvoters.includes(userId)) {
    updateSpec.$inc.numUpvotes = -1;
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, updateSpec, {
    new: true,
  });

  return updatedPost
    ? { ...updatedPost.toJSON(), comments: undefined } // TODO use $project instead
    : undefined;
};

const operations = {
  getPosts,
  getPostsByFilter,
  createPost,
  getPostByID,
  getPostsByUserID,
  getVotedPostsByUserID,
  upvotePost,
  downvotePost,
};

module.exports = operations;
