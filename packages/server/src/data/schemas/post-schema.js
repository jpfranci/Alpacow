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
  userId: ObjectId,
  username: String,
  tag: String,
  upvoters: [ObjectId],
  downvoters: [ObjectId],
});

module.exports = PostSchema;
