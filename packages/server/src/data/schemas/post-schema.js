const CommentSchema = require("./comment-schema");
const { Schema } = require("mongoose");

const LocationSchema = new Schema({
  type: String,
  coordinates: [Number],
});

const PostSchema = new Schema({
  title: String,
  body: String,
  date: Date,
  numUpvotes: Number,
  numDownvotes: Number,
  location: LocationSchema,
  comments: [CommentSchema],
  userId: { type: String, index: true },
  username: String,
  tag: String,
  upvoters: { type: [String], index: true },
  downvoters: { type: [String], index: true },
  isMature: { type: Boolean, index: true },
});

PostSchema.index({ location: "2dsphere" });

module.exports = PostSchema;
