const { Schema } = require("mongoose");

const CommentSchema = new Schema({
  body: String,
  date: Date,
  numUpvotes: Number,
  numDownvotes: Number,
  userId: String,
  username: String,
  upvoters: { type: [String], index: true },
  downvoters: { type: [String], index: true },
});

module.exports = CommentSchema;
