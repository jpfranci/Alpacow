const Post = require("../../models/post-model");

const createProjectionObject = (userId, showComments = false) => {
  const projection = {
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
      isUpvoted: { $in: [userId, "$upvoters"] },
      isDownvoted: { $in: [userId, "$downvoters"] },
    },
  };
  if (showComments) {
    projection.$project.comments = true;
  }
  return projection;
};

const createPost = async (post) => {
  const createdPost = await Post.create(post);
  return getPostByID(createdPost._id, post.userId);
};

const getPostsByFilter = async ({
  lon,
  lat,
  tagFilter,
  sortType,
  showMatureContent,
  userId,
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
  aggregationPipeline.push(createProjectionObject(userId));
  aggregationPipeline.push({
    // additional arguments are to break ties
    $sort:
      sortType === "popular"
        ? { score: -1, date: -1, _id: -1 }
        : { date: -1, _id: -1 },
  });
  return Post.aggregate(aggregationPipeline);
};

const getPostByID = (id, userId) => {
  return Post.findById(id, createProjectionObject(userId, true).$project);
};

const getPostsByUserID = async (userId, sortType) => {
  const aggregation = [];
  aggregation.push({
    $match: {
      userId: userId,
    },
  });
  aggregation.push(createProjectionObject(userId));
  aggregation.push({
    $sort:
      sortType === "popular"
        ? { score: -1, date: -1, _id: -1 }
        : { date: -1, _id: -1 },
  });
  return Post.aggregate(aggregation);
};

const getVotedPostsByUserID = async (userId, upvote) => {
  const voteField = upvote ? "upvoters" : "downvoters";

  const aggregation = [];
  aggregation.push({
    $match: {
      [voteField]: { $in: [userId] },
    },
  });
  aggregation.push(createProjectionObject(userId));
  return Post.aggregate(aggregation);
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

  return Post.findByIdAndUpdate(postId, updateSpec, {
    new: true,
    projection: createProjectionObject(userId).$project,
  });
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

  return Post.findByIdAndUpdate(postId, updateSpec, {
    new: true,
    projection: createProjectionObject(userId).$project,
  });
};

const operations = {
  getPostsByFilter,
  createPost,
  getPostByID,
  getPostsByUserID,
  getVotedPostsByUserID,
  upvotePost,
  downvotePost,
};

module.exports = operations;
