const { Schema } = require("mongoose");
const {
  Types: { ObjectId },
} = Schema;

const CommentSchema = new Schema({
  body: String,
  date: Date,
  numUpvotes: Number,
  numDownvotes: Number,
  userId: ObjectId,
  username: String,
});

module.exports = CommentSchema;
