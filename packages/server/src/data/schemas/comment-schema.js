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
  upvoters: { type: [ObjectId], index: true },
  downvoters: { type: [ObjectId], index: true },
});

module.exports = CommentSchema;
