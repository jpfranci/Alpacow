const Post = require("../../models/post-model");

const createProjectionObject = (userId, showComments = false) => {
  const projection = {
    $project: {
      title: true,
      body: true,
      date: true,
      score: { $subtract: [{ $size: "$upvoters" }, { $size: "$downvoters" }] },
      numUpvotes: { $size: "$upvoters" },
      numDownvotes: { $size: "$downvoters" },
      username: true,
      tag: true,
      isMature: true,
      isUpvoted: { $in: [userId, "$upvoters"] },
      isDownvoted: { $in: [userId, "$downvoters"] },
      userId: true,
    },
  };
  if (showComments) {
    projection.$project.comments = {
      $map: {
        input: "$comments",
        as: "c",
        in: {
          _id: "$$c._id",
          body: "$$c.body",
          date: "$$c.date",
          userId: "$$c.userId",
          username: "$$c.username",
          isMature: "$$c.isMature",
          numUpvotes: { $size: "$$c.upvoters" },
          numDownvotes: { $size: "$$c.downvoters" },
          isUpvoted: { $in: [userId, "$$c.upvoters"] },
          isDownvoted: { $in: [userId, "$$c.downvoters"] },
        },
      },
    };
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

const getPostsByUserID = async (userId, currentUserId, sortType) => {
  const aggregation = [];
  aggregation.push({
    $match: {
      userId: userId,
    },
  });
  aggregation.push(createProjectionObject(currentUserId));
  aggregation.push({
    $sort:
      sortType === "popular"
        ? { score: -1, date: -1, _id: -1 }
        : { date: -1, _id: -1 },
  });
  return Post.aggregate(aggregation);
};

const getVotedPostsByUserID = async (userId, currentUserId, upvote) => {
  const voteField = upvote ? "upvoters" : "downvoters";

  const aggregation = [];
  aggregation.push({
    $match: {
      [voteField]: { $in: [userId] },
    },
  });
  aggregation.push(createProjectionObject(currentUserId));
  return Post.aggregate(aggregation);
};

const upvotePost = async (postId, userId) => {
  const updateSpec = {
    $push: { upvoters: userId },
    $pull: { downvoters: userId },
  };

  const filter = {
    _id: postId,
    upvoters: { $nin: [userId] },
  };

  return Post.findOneAndUpdate(filter, updateSpec, {
    new: true,
    projection: createProjectionObject(userId).$project,
  });
};

const downvotePost = async (postId, userId) => {
  const updateSpec = {
    $push: { downvoters: userId },
    $pull: { upvoters: userId },
  };

  const filter = {
    _id: postId,
    downvoters: { $nin: [userId] },
  };

  return Post.findOneAndUpdate(filter, updateSpec, {
    new: true,
    projection: createProjectionObject(userId).$project,
  });
};

const upvoteComment = async (postId, commentId, userId) => {
  const updateSpec = {
    $push: { "comments.$[comment].upvoters": userId },
    $pull: { "comments.$[comment].downvoters": userId },
  };

  const filter = {
    _id: postId,
  };

  const options = {
    new: true,
    projection: createProjectionObject(userId, true).$project,
    arrayFilters: [
      {
        "comment._id": commentId,
        "comment.upvoters": { $nin: [userId] },
      },
    ],
  };

  const post = await Post.findOneAndUpdate(filter, updateSpec, options);
  const comment = await post.comments.find(
    (comment) => comment._id == commentId,
  );
  return comment;
};

const downvoteComment = async (postId, commentId, userId) => {
  const updateSpec = {
    $push: { "comments.$[comment].downvoters": userId },
    $pull: { "comments.$[comment].upvoters": userId },
  };

  const filter = {
    _id: postId,
  };

  const options = {
    new: true,
    projection: createProjectionObject(userId, true).$project,
    arrayFilters: [
      {
        "comment._id": commentId,
        "comment.downvoters": { $nin: [userId] },
      },
    ],
  };

  const post = await Post.findOneAndUpdate(filter, updateSpec, options);
  const comment = await post.comments.find(
    (comment) => comment._id == commentId,
  );
  return comment;
};

const updateUsername = async (userId, newUsername) => {
  return Post.updateMany(
    { userId },
    {
      username: newUsername,
    },
    { new: true },
  );
};

const operations = {
  getPostsByFilter,
  createPost,
  getPostByID,
  getPostsByUserID,
  getVotedPostsByUserID,
  upvotePost,
  downvotePost,
  upvoteComment,
  downvoteComment,
  updateUsername,
};

module.exports = operations;
