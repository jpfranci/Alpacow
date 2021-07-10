const CommentSchema = require("./comment-schema");
const { Schema } = require("mongoose");
const {
  Types: { ObjectId },
} = Schema;

const PostSchema = new Schema({
  title: String,
  body: String,
  date: Date,
  numUpvotes: Number,
  numDownvotes: Number,
  loc: {
    type: String,
    coordinates: [Number],
  },
  comments: [CommentSchema],
  userId: ObjectId,
  username: String,
});

module.exports = PostSchema;
