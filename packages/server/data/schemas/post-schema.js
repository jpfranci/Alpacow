const CommentSchema = require("comment-schema");
const { Schema } = require("mongoose");

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
});

export default PostSchema;
