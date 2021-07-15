const CommentSchema = require("./comment-schema");
const { Schema } = require("mongoose");
const {
  Types: { ObjectId },
} = Schema;

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
  userId: { type: ObjectId, index: true },
  username: String,
  tag: String,
  upvoters: { type: [ObjectId], index: true },
  downvoters: { type: [ObjectId], index: true },
});

module.exports = PostSchema;
