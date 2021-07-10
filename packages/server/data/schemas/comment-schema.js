const { Schema } = require("mongoose");

const CommentSchema = new Schema({
  body: String,
  date: Date,
  numUpvotes: Number,
  numDownvotes: Number,
});

export default CommentSchema;
