const mongoose = require("mongoose");
const Post = require("../../models/post-model");
const User = require("../../models/user-model");

const updateUserReputation = async (userId, amount) => {
  const userUpdateSpec = { $inc: { reputation: amount } };
  const userFilter = { _id: userId };
  await User.updateOne(userFilter, userUpdateSpec);
};

const updateUpvoteUserReputation = async (item, userId) => {
  const voterIndex = item.downvoters.findIndex((voter) => voter === userId);
  if (voterIndex != -1) {
    updateUserReputation(item.userId, 2);
  } else {
    updateUserReputation(item.userId, 1);
  }
};

const updateDownvoteUserReputation = async (item, userId) => {
  const voterIndex = item.upvoters.findIndex((voter) => voter === userId);
  if (voterIndex != -1) {
    updateUserReputation(item.userId, -2);
  } else {
    updateUserReputation(item.userId, -1);
  }
};

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

const getPostsByUserID = async ({
  userId,
  currentUserId,
  sortType,
  showMatureContent,
}) => {
  const aggregation = [];
  aggregation.push({
    $match: {
      userId: userId,
    },
  });
  aggregation.push(createProjectionObject(currentUserId));
  if (!showMatureContent) {
    aggregation.push({ $match: { isMature: false } });
  }
  aggregation.push({
    $sort:
      sortType === "popular"
        ? { score: -1, date: -1, _id: -1 }
        : { date: -1, _id: -1 },
  });
  return Post.aggregate(aggregation);
};

const getVotedPostsByUserID = async ({
  userId,
  currentUserId,
  isUpvoted,
  sortType,
  showMatureContent,
}) => {
  const voteField = isUpvoted ? "upvoters" : "downvoters";

  const aggregation = [];
  aggregation.push({
    $match: {
      [voteField]: { $in: [userId] },
    },
  });
  aggregation.push(createProjectionObject(currentUserId));
  if (!showMatureContent) {
    aggregation.push({ $match: { isMature: false } });
  }
  aggregation.push({
    $sort:
      sortType === "popular"
        ? { score: -1, date: -1, _id: -1 }
        : { date: -1, _id: -1 },
  });
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

  const post = await Post.findOneAndUpdate(filter, updateSpec, {
    new: false,
  });

  if (post) {
    updateUpvoteUserReputation(post, userId);
  } else {
    throw new Error("Post to upvote could not be found.");
  }

  return getPostByID(postId, userId);
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

  const post = await Post.findOneAndUpdate(filter, updateSpec, { new: false });

  if (post) {
    updateDownvoteUserReputation(post, userId);
  } else {
    throw new Error("Post to downvote could not be found");
  }
  return getPostByID(postId, userId);
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
    new: false,
    projection: createProjectionObject(userId, true).$project,
    arrayFilters: [
      {
        "comment._id": commentId,
        "comment.upvoters": { $nin: [userId] },
      },
    ],
  };

  const post = await Post.findOneAndUpdate(filter, updateSpec, options);

  try {
    const comment = await post.comments.find(
      (comment) => comment._id == commentId,
    );
    updateUpvoteUserReputation(comment, userId);

    const newPost = await getPostByID(postId, userId);
    const newComment = newPost.comments.find(
      (comment) => comment._id == commentId,
    );
    return newComment;
  } catch (err) {
    throw new Error("Comment to upvote could not be found: " + err.message);
  }
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
    new: false,
    arrayFilters: [
      {
        "comment._id": commentId,
        "comment.downvoters": { $nin: [userId] },
      },
    ],
  };

  const post = await Post.findOneAndUpdate(filter, updateSpec, options);

  try {
    const comment = await post.comments.find(
      (comment) => comment._id == commentId,
    );
    updateDownvoteUserReputation(comment, userId);

    const newPost = await getPostByID(postId, userId);
    const newComment = newPost.comments.find(
      (comment) => comment._id == commentId,
    );
    return newComment;
  } catch (err) {
    throw new Error("Comment to downvote could not be found: " + err);
  }
};

const updateUsername = (userId, newUsername) => {
  const updatePostsPromise = Post.updateMany(
    { userId },
    {
      username: newUsername,
    },
    { new: true },
  );
  const updateCommentsPromise = Post.updateMany(
    { "comments.userId": userId },
    { "comments.$.username": newUsername },
  );
  return Promise.all([updateCommentsPromise, updatePostsPromise]);
};

const createComment = async (comment, postId) => {
  // Generate new mongodb ID (mongoose doesn't set embedded doc ids automatically if we don't use .save())
  const commentId = new mongoose.Types.ObjectId();
  comment._id = commentId;

  const updateSpec = { $push: { comments: comment } };
  const filter = { _id: postId };
  const options = {
    new: true,
    projection: createProjectionObject(comment.userId, true).$project,
  };

  const post = await Post.findOneAndUpdate(filter, updateSpec, options);
  const newComment = post.comments.find((comment) =>
    commentId.equals(comment._id),
  );
  if (newComment) return newComment;
  throw new Error("Comment could not be found: " + err);
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
  createComment,
};

module.exports = operations;
